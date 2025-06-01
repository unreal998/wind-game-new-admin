import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { imageId: string } },
) {
  try {
    const imageId = params.imageId;
    const supabase = createClient();

    const { data, error } = await supabase.storage
      .from("users-images")
      .download(imageId);

    if (error) {
      throw error;
      console.log(request);
    }

    const buffer = await data.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": data.type,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return NextResponse.error();
  }
}
