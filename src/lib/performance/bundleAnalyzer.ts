/**
 * Bundle Size Optimization and Analysis
 * Tools for analyzing and optimizing Next.js bundle size for better performance
 */

import fs from 'fs/promises';
import path from 'path';

interface BundleAnalysis {
  totalSize: number;
  gzippedSize?: number;
  chunks: ChunkInfo[];
  largestFiles: FileInfo[];
  recommendations: string[];
  duplicates: DuplicateInfo[];
}

interface ChunkInfo {
  name: string;
  size: number;
  gzippedSize?: number;
  modules: string[];
  type: 'main' | 'vendor' | 'chunk' | 'static';
}

interface FileInfo {
  path: string;
  size: number;
  type: string;
  impact: 'high' | 'medium' | 'low';
}

interface DuplicateInfo {
  module: string;
  occurrences: number;
  totalSize: number;
  chunks: string[];
}

export class BundleAnalyzer {
  private buildDir: string;
  private analysisResults: BundleAnalysis | null = null;

  constructor(buildDir: string = '.next') {
    this.buildDir = buildDir;
  }

  /**
   * Analyze the built bundle for optimization opportunities
   */
  async analyzeBuild(): Promise<BundleAnalysis> {
    try {
      const buildPath = path.resolve(this.buildDir);
      const staticPath = path.join(buildPath, 'static');
      
      const chunks = await this.analyzeChunks(staticPath);
      const largestFiles = await this.findLargestFiles(buildPath);
      const duplicates = await this.findDuplicateModules(chunks);
      
      const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
      
      const recommendations = this.generateRecommendations(chunks, largestFiles, duplicates);
      
      this.analysisResults = {
        totalSize,
        chunks,
        largestFiles,
        recommendations,
        duplicates
      };
      
      return this.analysisResults;
    } catch (error) {
      console.error('Bundle analysis failed:', error);
      throw new Error('Failed to analyze bundle');
    }
  }

  /**
   * Analyze individual chunks
   */
  private async analyzeChunks(staticPath: string): Promise<ChunkInfo[]> {
    const chunks: ChunkInfo[] = [];
    
    try {
      const jsDir = path.join(staticPath, 'chunks');
      const files = await fs.readdir(jsDir, { withFileTypes: true });
      
      for (const file of files) {
        if (file.isFile() && file.name.endsWith('.js')) {
          const filePath = path.join(jsDir, file.name);
          const stats = await fs.stat(filePath);
          
          chunks.push({
            name: file.name,
            size: stats.size,
            modules: [], // Would need source map analysis for detailed modules
            type: this.determineChunkType(file.name)
          });
        }
      }
      
      return chunks.sort((a, b) => b.size - a.size);
    } catch (error) {
      console.warn('Could not analyze chunks:', error);
      return [];
    }
  }

  /**
   * Find largest files in the build
   */
  private async findLargestFiles(buildPath: string): Promise<FileInfo[]> {
    const files: FileInfo[] = [];
    
    try {
      await this.walkDirectory(buildPath, async (filePath, stats) => {
        const relativePath = path.relative(buildPath, filePath);
        const ext = path.extname(filePath);
        
        if (stats.size > 10000) { // Files larger than 10KB
          files.push({
            path: relativePath,
            size: stats.size,
            type: ext,
            impact: this.assessImpact(stats.size, ext)
          });
        }
      });
      
      return files.sort((a, b) => b.size - a.size).slice(0, 20); // Top 20
    } catch (error) {
      console.warn('Could not analyze files:', error);
      return [];
    }
  }

  /**
   * Walk directory recursively
   */
  private async walkDirectory(
    dir: string,
    callback: (filePath: string, stats: any) => Promise<void>
  ): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        await this.walkDirectory(fullPath, callback);
      } else {
        const stats = await fs.stat(fullPath);
        await callback(fullPath, stats);
      }
    }
  }

  /**
   * Find duplicate modules (placeholder - would need detailed source map analysis)
   */
  private async findDuplicateModules(chunks: ChunkInfo[]): Promise<DuplicateInfo[]> {
    // This would require actual bundle analysis tools like webpack-bundle-analyzer
    // For now, return empty array with placeholder logic
    return [];
  }

  /**
   * Determine chunk type based on filename patterns
   */
  private determineChunkType(filename: string): ChunkInfo['type'] {
    if (filename.includes('main') || filename.includes('app')) return 'main';
    if (filename.includes('vendor') || filename.includes('node_modules')) return 'vendor';
    if (filename.match(/\.(css|png|jpg|svg|woff|woff2)$/)) return 'static';
    return 'chunk';
  }

  /**
   * Assess performance impact of a file
   */
  private assessImpact(size: number, ext: string): FileInfo['impact'] {
    const sizeKB = size / 1024;
    
    // JavaScript files have higher impact
    if (ext === '.js') {
      if (sizeKB > 500) return 'high';
      if (sizeKB > 100) return 'medium';
      return 'low';
    }
    
    // Other assets
    if (sizeKB > 1000) return 'high';
    if (sizeKB > 200) return 'medium';
    return 'low';
  }

  /**
   * Generate optimization recommendations
   */
  private generateRecommendations(
    chunks: ChunkInfo[],
    largestFiles: FileInfo[],
    duplicates: DuplicateInfo[]
  ): string[] {
    const recommendations: string[] = [];
    
    // Large bundle recommendations
    const totalSizeMB = chunks.reduce((sum, chunk) => sum + chunk.size, 0) / (1024 * 1024);
    if (totalSizeMB > 5) {
      recommendations.push('Total bundle size exceeds 5MB - consider code splitting and lazy loading');
    }
    
    // Large chunk recommendations
    const largeChunks = chunks.filter(chunk => chunk.size > 1024 * 1024); // 1MB+
    if (largeChunks.length > 0) {
      recommendations.push(`Found ${largeChunks.length} chunks larger than 1MB - consider breaking them down`);
    }
    
    // Asset recommendations
    const largeImages = largestFiles.filter(file => 
      ['.jpg', '.png', '.gif', '.svg'].includes(file.type) && file.size > 500 * 1024
    );
    if (largeImages.length > 0) {
      recommendations.push('Optimize large images - use next/image and modern formats like WebP');
    }
    
    // Font recommendations
    const largeFonts = largestFiles.filter(file =>
      ['.woff', '.woff2', '.ttf'].includes(file.type) && file.size > 100 * 1024
    );
    if (largeFonts.length > 0) {
      recommendations.push('Consider subsetting fonts or using variable fonts');
    }
    
    // Vendor chunk recommendations
    const vendorChunks = chunks.filter(chunk => chunk.type === 'vendor');
    const vendorSize = vendorChunks.reduce((sum, chunk) => sum + chunk.size, 0);
    if (vendorSize > 2 * 1024 * 1024) { // 2MB+
      recommendations.push('Large vendor bundle detected - consider tree shaking and dynamic imports');
    }
    
    return recommendations;
  }

  /**
   * Generate optimization report
   */
  generateReport(): string {
    if (!this.analysisResults) {
      return 'No analysis results available. Run analyzeBuild() first.';
    }
    
    const { totalSize, chunks, largestFiles, recommendations } = this.analysisResults;
    const totalSizeMB = (totalSize / (1024 * 1024)).toFixed(2);
    
    let report = `
# Bundle Analysis Report

## Summary
- **Total Bundle Size**: ${totalSizeMB}MB
- **Number of Chunks**: ${chunks.length}
- **Largest Files**: ${largestFiles.length}

## Largest Chunks
${chunks.slice(0, 10).map((chunk, i) => 
  `${i + 1}. **${chunk.name}** (${chunk.type}): ${(chunk.size / 1024).toFixed(1)}KB`
).join('\n')}

## Largest Files
${largestFiles.slice(0, 10).map((file, i) =>
  `${i + 1}. **${file.path}**: ${(file.size / 1024).toFixed(1)}KB (${file.impact} impact)`
).join('\n')}

## Recommendations
${recommendations.map((rec, i) => `${i + 1}. ${rec}`).join('\n')}

## Next Steps
1. Implement code splitting with dynamic imports
2. Optimize images using next/image
3. Enable compression in production
4. Consider using a CDN for static assets
5. Implement bundle analysis in CI/CD pipeline
`;
    
    return report;
  }

  /**
   * Get bundle size for specific routes (placeholder)
   */
  async analyzeRouteSize(routePath: string): Promise<{ size: number; chunks: string[] }> {
    // This would require route-specific bundle analysis
    // For now, return placeholder
    return {
      size: 0,
      chunks: []
    };
  }
}

/**
 * Webpack bundle analyzer integration helper
 */
export class WebpackBundleHelper {
  /**
   * Generate webpack bundle analyzer configuration
   */
  static getBundleAnalyzerConfig() {
    return {
      enabled: process.env.ANALYZE === 'true',
      bundleAnalyzerConfig: {
        mode: 'server',
        openAnalyzer: true,
        analyzerPort: 8888
      }
    };
  }

  /**
   * Create next.config.js snippet for bundle analysis
   */
  static getNextConfigSnippet(): string {
    return `
// Add this to your next.config.js for bundle analysis
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  // Your existing Next.js config
  experimental: {
    bundlePagesExternals: false,
  },
  webpack: (config, { isServer }) => {
    // Bundle optimization
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\\\/]node_modules[\\\\/]/,
            name: 'vendors',
            priority: 10,
            enforce: true,
          },
        },
      };
    }
    
    return config;
  },
});

// Run with: ANALYZE=true npm run build
`;
  }
}

/**
 * Performance budget checker
 */
export class PerformanceBudget {
  private budgets: Record<string, number> = {
    'total_js': 1024 * 1024, // 1MB
    'total_css': 200 * 1024,  // 200KB
    'main_bundle': 500 * 1024, // 500KB
    'vendor_bundle': 800 * 1024, // 800KB
  };

  /**
   * Check if bundle meets performance budget
   */
  checkBudget(analysis: BundleAnalysis): {
    passed: boolean;
    violations: { budget: string; actual: number; limit: number }[];
  } {
    const violations: { budget: string; actual: number; limit: number }[] = [];
    
    // Check total JS size
    const totalJS = analysis.chunks
      .filter(chunk => chunk.name.endsWith('.js'))
      .reduce((sum, chunk) => sum + chunk.size, 0);
    
    if (totalJS > this.budgets.total_js) {
      violations.push({
        budget: 'total_js',
        actual: totalJS,
        limit: this.budgets.total_js
      });
    }
    
    // Check main bundle size
    const mainChunk = analysis.chunks.find(chunk => chunk.type === 'main');
    if (mainChunk && mainChunk.size > this.budgets.main_bundle) {
      violations.push({
        budget: 'main_bundle',
        actual: mainChunk.size,
        limit: this.budgets.main_bundle
      });
    }
    
    return {
      passed: violations.length === 0,
      violations
    };
  }
}

// Export singleton instances
export const bundleAnalyzer = new BundleAnalyzer();
export const performanceBudget = new PerformanceBudget();
