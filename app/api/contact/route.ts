/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/contact/route.ts
import { NextResponse } from "next/server";
import { sendMail } from "@/app/utils/sendMail";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Email pour l'administrateur
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #013932;">New Contact Message</h2>
        <p>You have received a new message through the contact form:</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <strong>Name:</strong> ${name}<br>
          <strong>Email:</strong> ${email}<br>
          <strong>Message:</strong><br>
          ${message.replace(/\n/g, "<br>")}
        </div>

        <p style="color: #666; font-size: 14px;">
          Sent on: ${new Date().toLocaleString("en-US")}
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">
          This message was sent via the contact form
        </p>
      </div>
    `;

    // Email de confirmation pour l'utilisateur
    const userHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #013932;">Message Received Confirmation</h2>
        <p>Hello <strong>${name}</strong>,</p>
        <p>We have successfully received your message and will get back to you as soon as possible.</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <strong>Summary of your message:</strong><br>
          ${message.replace(/\n/g, "<br>")}
        </div>

        <p style="color: #666; font-size: 14px;">
          If you have urgent questions, please don't hesitate to contact us directly.
        </p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">
          This is an automated confirmation email, please do not reply.
        </p>
      </div>
    `;

    // Envoi à l'administrateur
    await sendMail({
      to: "thibault.mir@servier.com",
      subject: "🎄 Christmas Deals - New Contact Form Message",
      html: adminHtml,
    });

    // Envoi de confirmation à l'utilisateur
    await sendMail({
      to: email,
      subject: "🎄 Christmas Deals - We've Received Your Message",
      html: userHtml,
    });

    console.log(`📧 Contact message sent by: ${name} (${email})`);

    return NextResponse.json(
      {
        message: "Your message has been sent successfully",
        success: true,
      },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error: any) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      {
        error: "Error sending message",
        success: false,
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

// Ajoute aussi OPTIONS pour CORS si nécessaire
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
