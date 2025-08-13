import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { generateHTML } from "@tiptap/html/server";
import StarterKit from "@tiptap/starter-kit";
import { PDFDocument, rgb } from "pdf-lib";


export async function POST(request: Request) {
  try {
    console.log("POST /api/export started");
    const { documentId } = await request.json();
    console.log("Received documentId:", documentId);

    const { data, error } = await supabaseAdmin
      .from("Document")
      .select("*")
      .eq("id", documentId)
      .single();

    console.log("Supabase query result:", { data, error });

    if (error || !data) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    console.log("Generating HTML from TipTap content...");
    const htmlBody = generateHTML(data.content, [StarterKit]);
    console.log("Generated HTML:", htmlBody);

    // Create a new PDF using pdf-lib
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();

    // Set up some basic layout
    const { width, height } = page.getSize();
    let y = height - 50;

    // Title in bold, larger font
    page.drawText(data.title, {
      x: 50,
      y,
      size: 24,
      font: await pdfDoc.embedFont('Helvetica-Bold'),
      color: rgb(0, 0, 0),
    });
    y -= 40;

    // Write the htmlBody as plain text (no HTML rendering)
    const text = htmlBody.replace(/<[^>]+>/g, ''); // Remove HTML tags
    page.drawText(text, {
      x: 50,
      y,
      size: 12,
      font: await pdfDoc.embedFont('Helvetica'),
      color: rgb(0, 0, 0),
      maxWidth: width - 100,
      lineHeight: 16,
    });

    const pdfBytes = await pdfDoc.save();

    return new Response(new Uint8Array(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${data.title}.pdf"`,
      },
    });
  } catch (err: any) {
    console.error("Error in POST /api/export:", err && err.stack ? err.stack : err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
