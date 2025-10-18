/**
 * Event Sourcing System
 * Implementa padrão de Event Sourcing para auditoria e rollback de dados
 */

// Domain Events
interface DomainEvent {
  id: string;
  type: string;
  aggregateId: string;
  aggregateType: string;
  data: any;
  metadata: {
    userId?: string;
    timestamp: Date;
    version: number;
    correlationId?: string;
    causationId?: string;
  };
}

interface EventStore {
  saveEvent(event: DomainEvent): Promise<void>;
  getEvents(aggregateId: string, fromVersion?: number): Promise<DomainEvent[]>;
  getEventsByType(eventType: string): Promise<DomainEvent[]>;
  getAllEvents(fromTimestamp?: Date): Promise<DomainEvent[]>;
}

// In-Memory Event Store (para desenvolvimento)
class InMemoryEventStore implements EventStore {
  private events: DomainEvent[] = [];

  async saveEvent(event: DomainEvent): Promise<void> {
    this.events.push({
      ...event,
      metadata: {
        ...event.metadata,
        timestamp: new Date()
      }
    });
  }

  async getEvents(aggregateId: string, fromVersion = 0): Promise<DomainEvent[]> {
    return this.events
      .filter(event => 
        event.aggregateId === aggregateId && 
        event.metadata.version >= fromVersion
      )
      .sort((a, b) => a.metadata.version - b.metadata.version);
  }

  async getEventsByType(eventType: string): Promise<DomainEvent[]> {
    return this.events.filter(event => event.type === eventType);
  }

  async getAllEvents(fromTimestamp?: Date): Promise<DomainEvent[]> {
    if (!fromTimestamp) return [...this.events];
    
    return this.events.filter(event => 
      event.metadata.timestamp >= fromTimestamp
    );
  }
}

// Event Bus para notificações
class EventBus {
  private handlers = new Map<string, Array<(event: DomainEvent) => Promise<void>>>();

  subscribe(eventType: string, handler: (event: DomainEvent) => Promise<void>) {
    const handlers = this.handlers.get(eventType) || [];
    handlers.push(handler);
    this.handlers.set(eventType, handlers);
  }

  async publish(event: DomainEvent): Promise<void> {
    const handlers = this.handlers.get(event.type) || [];
    
    // Execute handlers in parallel
    await Promise.all(
      handlers.map(handler => 
        handler(event).catch(error => 
          console.error(`Error handling event ${event.type}:`, error)
        )
      )
    );
  }
}

// Aggregate Base Class
abstract class Aggregate {
  protected id: string;
  protected version = 0;
  private uncommittedEvents: DomainEvent[] = [];

  constructor(id: string) {
    this.id = id;
  }

  getId(): string {
    return this.id;
  }

  getVersion(): number {
    return this.version;
  }

  getUncommittedEvents(): DomainEvent[] {
    return [...this.uncommittedEvents];
  }

  markEventsAsCommitted(): void {
    this.uncommittedEvents = [];
  }

  protected applyEvent(event: DomainEvent): void {
    this.handleEvent(event);
    this.uncommittedEvents.push(event);
    this.version++;
  }

  // Subclasses must implement this to handle specific events
  protected abstract handleEvent(event: DomainEvent): void;

  // Replay events to rebuild state
  static fromEvents<T extends Aggregate>(
    constructor: new (id: string) => T,
    events: DomainEvent[]
  ): T {
    const id = events[0]?.aggregateId || '';
    const aggregate = new constructor(id);
    
    events.forEach(event => {
      aggregate.handleEvent(event);
      aggregate.version = event.metadata.version;
    });
    
    return aggregate;
  }
}

// CV Aggregate Example
interface CVCreated {
  type: 'CVCreated';
  data: {
    userId: string;
    template: string;
    personalInfo: any;
  };
}

interface CVUpdated {
  type: 'CVUpdated';
  data: {
    section: string;
    changes: any;
  };
}

interface CVPublished {
  type: 'CVPublished';
  data: {
    publishedAt: Date;
    format: string;
  };
}

type CVEvent = CVCreated | CVUpdated | CVPublished;

class CVAggregate extends Aggregate {
  private userId: string = '';
  private template: string = '';
  private personalInfo: any = {};
  private sections: Record<string, any> = {};
  private publishedVersions: Array<{ version: number; publishedAt: Date; format: string }> = [];

  static create(id: string, userId: string, template: string, personalInfo: any): CVAggregate {
    const cv = new CVAggregate(id);
    
    const event: DomainEvent = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
      type: 'CVCreated',
      aggregateId: id,
      aggregateType: 'CV',
      data: { userId, template, personalInfo },
      metadata: {
        userId,
        timestamp: new Date(),
        version: cv.version + 1,
        correlationId: `${Date.now()}-${Math.random().toString(36).substring(2)}`
      }
    };

    cv.applyEvent(event);
    return cv;
  }

  updateSection(section: string, changes: any, userId: string): void {
    const event: DomainEvent = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
      type: 'CVUpdated',
      aggregateId: this.id,
      aggregateType: 'CV',
      data: { section, changes },
      metadata: {
        userId,
        timestamp: new Date(),
        version: this.version + 1,
        correlationId: `${Date.now()}-${Math.random().toString(36).substring(2)}`
      }
    };

    this.applyEvent(event);
  }

  publish(format: string, userId: string): void {
    const event: DomainEvent = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2)}`,
      type: 'CVPublished',
      aggregateId: this.id,
      aggregateType: 'CV',
      data: { publishedAt: new Date(), format },
      metadata: {
        userId,
        timestamp: new Date(),
        version: this.version + 1,
        correlationId: `${Date.now()}-${Math.random().toString(36).substring(2)}`
      }
    };

    this.applyEvent(event);
  }

  protected handleEvent(event: DomainEvent): void {
    switch (event.type) {
      case 'CVCreated':
        this.userId = event.data.userId;
        this.template = event.data.template;
        this.personalInfo = event.data.personalInfo;
        break;

      case 'CVUpdated':
        this.sections[event.data.section] = {
          ...this.sections[event.data.section],
          ...event.data.changes
        };
        break;

      case 'CVPublished':
        this.publishedVersions.push({
          version: event.metadata.version,
          publishedAt: event.data.publishedAt,
          format: event.data.format
        });
        break;
    }
  }

  // Getters for current state
  getCurrentState() {
    return {
      id: this.id,
      version: this.version,
      userId: this.userId,
      template: this.template,
      personalInfo: this.personalInfo,
      sections: this.sections,
      publishedVersions: this.publishedVersions
    };
  }
}

// Repository with Event Sourcing
class CVRepository {
  constructor(
    private eventStore: EventStore,
    private eventBus: EventBus
  ) {}

  async save(cv: CVAggregate): Promise<void> {
    const events = cv.getUncommittedEvents();
    
    // Save events to store
    for (const event of events) {
      await this.eventStore.saveEvent(event);
      // Publish to event bus for projections/handlers
      await this.eventBus.publish(event);
    }
    
    cv.markEventsAsCommitted();
  }

  async getById(id: string): Promise<CVAggregate | null> {
    const events = await this.eventStore.getEvents(id);
    
    if (events.length === 0) {
      return null;
    }

    return CVAggregate.fromEvents(CVAggregate, events);
  }

  // Get state at specific version (time travel!)
  async getByIdAtVersion(id: string, version: number): Promise<CVAggregate | null> {
    const events = await this.eventStore.getEvents(id, 0);
    const eventsUpToVersion = events.filter(e => e.metadata.version <= version);
    
    if (eventsUpToVersion.length === 0) {
      return null;
    }

    return CVAggregate.fromEvents(CVAggregate, eventsUpToVersion);
  }
}

// Event Handlers for Read Models/Projections
class CVProjectionHandler {
  constructor(private eventBus: EventBus) {
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.eventBus.subscribe('CVCreated', this.handleCVCreated.bind(this));
    this.eventBus.subscribe('CVUpdated', this.handleCVUpdated.bind(this));
    this.eventBus.subscribe('CVPublished', this.handleCVPublished.bind(this));
  }

  private async handleCVCreated(event: DomainEvent): Promise<void> {
    // Update read model/projection
    console.log('CV Created projection update:', event);
    
    // Could update database, search index, etc.
    // await this.database.cvProjections.create({
    //   id: event.aggregateId,
    //   userId: event.data.userId,
    //   template: event.data.template,
    //   createdAt: event.metadata.timestamp,
    //   version: event.metadata.version
    // });
  }

  private async handleCVUpdated(event: DomainEvent): Promise<void> {
    console.log('CV Updated projection update:', event);
    
    // Update search indexes, cache invalidation, etc.
  }

  private async handleCVPublished(event: DomainEvent): Promise<void> {
    console.log('CV Published - sending notifications:', event);
    
    // Trigger notifications, analytics, etc.
  }
}

// Singleton instances
const eventStore = new InMemoryEventStore();
const eventBus = new EventBus();
const cvRepository = new CVRepository(eventStore, eventBus);

// Initialize projections
new CVProjectionHandler(eventBus);

export {
  CVAggregate,
  CVRepository,
  cvRepository,
  eventStore,
  eventBus,
  type DomainEvent
};