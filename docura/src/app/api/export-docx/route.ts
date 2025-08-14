import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { generateHTML } from "@tiptap/html/server";
import StarterKit from "@tiptap/starter-kit";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";

export async function POST(request: Request) {
  try {
    console.log("POST /api/export-docx started");
    const { documentId } = await request.json();
    console.log("Received documentId:", documentId);

    const { data, error } = await supabaseAdmin
      .from("Document")
      .select("*")
      .eq("id", documentId)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    console.log("Generating HTML from TipTap content...");
    const htmlBody = generateHTML(data.content, [StarterKit]);

    // Strip HTML tags to get plain text content
    const plainText = htmlBody.replace(/<[^>]*>/g, "");

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: data.title,
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              children: [new TextRun(plainText)],
            }),
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);

    // Convert Node.js Buffer to Uint8Array for the Web Response API
    const uint8Array = new Uint8Array(buffer);

    return new Response(uint8Array, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${data.title}.docx"`,
      },
    });
  } catch (err) {
    console.error("Error in POST /api/export-docx:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}