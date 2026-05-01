"use client";
import React, { useState } from 'react';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Font } from '@react-pdf/renderer';
import { Download, FileText, FileDown, Lock, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { TEMPLATES } from "@/lib/templates/registry";
import { DocxExportEngine } from "@/lib/export/docx-engine";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { saveAs } from "file-saver";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Register High-Fidelity Fonts for PDF
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCOjFGCW8CwpnyBTfLdfyUvWbX2ng.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcC7jFGCW8CwpnyBTfLdfyUvWbX2ng.ttf', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcC7jFGCW8CwpnyBTfLdfyUvWbX2ng.ttf', fontWeight: 700 },
  ],
});

Font.register({
  family: 'Playfair Display',
  src: 'https://fonts.gstatic.com/s/playfairdisplay/v21/6NU68F6fe02mt7YcaT9n5mXNWVPRQfM.ttf',
});

const createStyles = (template: any) => StyleSheet.create({
  page: { padding: 40, backgroundColor: '#ffffff', fontFamily: template.id === "executive" ? 'Playfair Display' : 'Inter', color: '#18181b' },
  header: { marginBottom: 20, textAlign: template.id === "modern" ? 'left' : 'center', borderBottomWidth: 1, borderBottomColor: template.styles.accentColor, paddingBottom: 15 },
  name: { fontSize: 28, fontWeight: 700, textTransform: 'uppercase', marginBottom: 5 },
  contact: { fontSize: 9, color: '#71717a', flexDirection: 'row', justifyContent: template.id === "modern" ? 'flex-start' : 'center', gap: 10 },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.2, color: template.styles.accentColor, marginBottom: 8, borderBottomWidth: 0.5, borderBottomColor: '#e4e4e7', paddingBottom: 3 },
  content: { fontSize: 10, lineHeight: 1.5, color: '#3f3f46' },
  expItem: { marginBottom: 12 },
  expHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 },
  role: { fontSize: 11, fontWeight: 700 },
  company: { fontSize: 10, fontWeight: 600, color: '#52525b' },
  date: { fontSize: 9, color: '#a1a1aa' },
  skillContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  skillBadge: { fontSize: 8, backgroundColor: '#f4f4f5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 2, color: '#52525b' },
});

const DynamicPDF = ({ data, templateId, documentType }: { data: any, templateId: string, documentType: string }) => {
  const template = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[0];
  const styles = createStyles(template);

  if (documentType === "cover_letter") {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.name}>{data.personalInfo.name || "Your Name"}</Text>
            <View style={styles.contact}>
              <Text>{data.personalInfo.email}</Text>
              <Text>{data.personalInfo.phone}</Text>
              <Text>{data.personalInfo.location}</Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={{ fontSize: 10, color: '#a1a1aa', marginBottom: 20 }}>
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </Text>
            <Text style={styles.content}>{data.summary}</Text>
            <View style={{ marginTop: 40 }}>
              <Text style={styles.content}>Sincerely,</Text>
              <Text style={{ ...styles.content, fontWeight: 'bold', marginTop: 5 }}>{data.personalInfo.name}</Text>
            </View>
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{data.personalInfo.name || "Your Name"}</Text>
          <View style={styles.contact}>
            <Text>{data.personalInfo.email}</Text>
            <Text>{data.personalInfo.phone}</Text>
            <Text>{data.personalInfo.location}</Text>
          </View>
        </View>
        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.content}>{data.summary}</Text>
          </View>
        )}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {data.experience.map((exp: any, i: number) => (
            <View key={i} style={styles.expItem}>
              <View style={styles.expHeader}>
                <Text style={styles.role}>{exp.role}</Text>
                <Text style={styles.date}>{exp.period}</Text>
              </View>
              <Text style={styles.company}>{exp.company}</Text>
              <Text style={styles.content}>{exp.description}</Text>
            </View>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillContainer}>
            {data.skills.map((skill: string, i: number) => (
              <Text key={i} style={styles.skillBadge}>{skill}</Text>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

interface Props {
  data: any;
  templateId: string;
  documentType: string;
  isPro?: boolean;
  onUpgrade?: () => void;
}

export function ExportActions({ data, templateId, documentType, isPro = false, onUpgrade }: Props) {
  const [isExportingDocx, setIsExportingDocx] = useState(false);

  const handleDocxExport = async () => {
    if (!isPro) {
      onUpgrade?.();
      return;
    }

    try {
      setIsExportingDocx(true);
      const blob = await DocxExportEngine.export(data);
      saveAs(blob, `${data.personalInfo.name?.replace(/\s+/g, '_') || 'Resume'}.docx`);
    } catch (error) {
      console.error("DOCX Export Error:", error);
    } finally {
      setIsExportingDocx(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className="gap-2 bg-zinc-900 hover:bg-zinc-800 text-white">
          <Download className="h-4 w-4" />
          Export
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-2">
        <div className="px-2 py-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
          Standard formats
        </div>
        <PDFDownloadLink
          document={<DynamicPDF data={data} templateId={templateId} documentType={documentType} />}
          fileName={`${data.personalInfo.name?.replace(/\s+/g, '_') || (documentType === 'resume' ? 'Resume' : 'Cover_Letter')}.pdf`}
          className="w-full"
        >
          {({ loading }) => (
            <DropdownMenuItem disabled={loading} className="gap-3 cursor-pointer py-2.5">
              <div className="bg-red-50 p-2 rounded-lg text-red-600">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold">Download PDF</span>
                <span className="text-[10px] text-zinc-500">{loading ? "Preparing..." : "Best for sharing"}</span>
              </div>
            </DropdownMenuItem>
          )}
        </PDFDownloadLink>

        <DropdownMenuSeparator className="my-2" />
        
        <div className="px-2 py-1.5 text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center justify-between">
          Premium formats
          {!isPro && <Lock className="h-3 w-3" />}
        </div>
        <DropdownMenuItem 
          onClick={handleDocxExport} 
          disabled={isExportingDocx}
          className="gap-3 cursor-pointer py-2.5 group"
        >
          <div className="bg-blue-50 p-2 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
            <FileDown className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold">Word Document</span>
              {!isPro && <Badge variant="outline" className="text-[8px] h-3 px-1 bg-indigo-50 text-indigo-700 border-indigo-100">PRO</Badge>}
            </div>
            <span className="text-[10px] text-zinc-500">{isExportingDocx ? "Generating..." : "Best for editing"}</span>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
