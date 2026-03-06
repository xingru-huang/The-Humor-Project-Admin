import { createSupabaseServerClient } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  let profileId: string | null = null;

  if (user.email) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", user.email)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    profileId = profile?.id ?? null;
  }

  const { data, error } = await supabase
    .from("images")
    .insert({
      url: body.url,
      is_common_use: body.is_common_use ?? false,
      is_public: body.is_public ?? false,
      image_description: body.image_description || null,
      celebrity_recognition: body.celebrity_recognition || null,
      profile_id: profileId,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data);
}
