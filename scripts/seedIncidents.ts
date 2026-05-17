import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function main() {
  const { sampleIncidents, buildIncidentDocument } = await import(
    "../data/sampleIncidents"
  );
  const { createEmbedding } = await import("../lib/gemini");
  const { supabaseAdmin } = await import("../lib/supabaseAdmin");

  console.log("Deleting existing incidents...");

  const { error: deleteError } = await supabaseAdmin
    .from("incidents")
    .delete()
    .neq("id", 0);

  if (deleteError) {
    throw deleteError;
  }

  console.log("Creating embeddings and inserting incidents...");

  for (const incident of sampleIncidents) {
    const incidentDocument = buildIncidentDocument(incident);
    const embedding = await createEmbedding(incidentDocument);

    const { error } = await supabaseAdmin.from("incidents").insert({
      title: incident.title,
      service: incident.service,
      severity: incident.severity,
      symptoms: incident.symptoms,
      root_cause: incident.rootCause,
      resolution: incident.resolution,
      tags: incident.tags,
      embedding,
    });

    if (error) {
      throw error;
    }

    console.log(`Inserted: ${incident.title}`);
  }

  console.log("Incident seeding completed.");
}

main().catch((error) => {
  console.error("Failed to seed incidents:", error);
  process.exit(1);
});