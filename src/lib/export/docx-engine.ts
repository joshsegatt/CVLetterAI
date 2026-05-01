import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, SectionType } from "docx";
import { saveAs } from "file-saver";

export class DocxExportEngine {
  static async export(data: any) {
    const doc = new Document({
      sections: [{
        properties: {
          type: SectionType.CONTINUOUS,
        },
        children: [
          // Header
          new Paragraph({
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            children: [
              new TextRun({
                text: data.personalInfo.name || "Untitled Profile",
                bold: true,
                size: 32,
                font: "Geist",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: `${data.personalInfo.location} | ${data.personalInfo.email} | ${data.personalInfo.phone}`,
                size: 20,
                font: "Geist",
              }),
            ],
          }),

          // Summary
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: "PROFESSIONAL SUMMARY", bold: true, size: 24, font: "Geist" })],
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            children: [new TextRun({ text: data.summary, size: 22, font: "Geist" })],
          }),

          // Experience
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: "PROFESSIONAL EXPERIENCE", bold: true, size: 24, font: "Geist" })],
            spacing: { before: 400, after: 200 },
          }),
          ...data.experience.flatMap((exp: any) => [
            new Paragraph({
              children: [
                new TextRun({ text: exp.company, bold: true, size: 22, font: "Geist" }),
                new TextRun({ text: ` | ${exp.role}`, size: 22, font: "Geist" }),
              ],
            }),
            new Paragraph({
              children: [new TextRun({ text: exp.period, italics: true, size: 18, font: "Geist" })],
              spacing: { after: 100 },
            }),
            new Paragraph({
              children: [new TextRun({ text: exp.description, size: 20, font: "Geist" })],
              spacing: { after: 300 },
            }),
          ]),

          // Education
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: "EDUCATION", bold: true, size: 24, font: "Geist" })],
            spacing: { before: 400, after: 200 },
          }),
          ...data.education.flatMap((edu: any) => [
            new Paragraph({
              children: [
                new TextRun({ text: edu.institution, bold: true, size: 22, font: "Geist" }),
                new TextRun({ text: ` | ${edu.degree}`, size: 22, font: "Geist" }),
              ],
            }),
            new Paragraph({
              children: [new TextRun({ text: edu.period, italics: true, size: 18, font: "Geist" })],
              spacing: { after: 100 },
            }),
          ]),

          // Skills
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            children: [new TextRun({ text: "SKILLS", bold: true, size: 24, font: "Geist" })],
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            children: [new TextRun({ text: data.skills.join(", "), size: 20, font: "Geist" })],
          }),
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    return blob;
  }
}
