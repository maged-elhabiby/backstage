const BASE = "http://localhost:3000";

const DEMO_BRAIN_DUMP =
  "I have a client presentation tomorrow and the deck isn't done. My manager keeps pinging me about the Q3 report that was due yesterday. I haven't eaten since breakfast and it's 4pm. I also promised my partner I'd be home by 6 but there's no way. And I keep thinking maybe I should just quit and start that side project. My inbox has 47 unread messages and I just realized I forgot to reply to the CEO's email from Monday. The same thing happened last week — I keep ending up in this exact same spiral.";

async function run() {
  const totalStart = Date.now();

  // Step 1: Cast
  console.log("\n🎭 Calling /api/cast...");
  const castStart = Date.now();
  const castRes = await fetch(`${BASE}/api/cast`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ brainDump: DEMO_BRAIN_DUMP }),
  });
  const casting = await castRes.json();
  console.log(`  ⏱ ${Date.now() - castStart}ms`);
  console.log(`  Freeze frame: ${casting.freeze_frame}`);
  console.log(`  Scene label: ${casting.scene_label}`);
  console.log(`  Characters cast: ${casting.characters.map((c: { type: string }) => c.type).join(", ")}`);

  // Step 2: Characters
  console.log("\n🎪 Calling /api/characters...");
  const charStart = Date.now();
  const charRes = await fetch(`${BASE}/api/characters`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ brainDump: DEMO_BRAIN_DUMP, characters: casting.characters }),
  });
  const characters = await charRes.json();
  console.log(`  ⏱ ${Date.now() - charStart}ms`);
  for (const c of characters) {
    console.log(`  ${c.emoji} ${c.name} (intensity ${c.intensity}/10): "${c.line}"`);
    console.log(`     Protecting: ${c.protecting}`);
  }

  // Step 3: Moderator
  console.log("\n🎯 Calling /api/moderator...");
  const modStart = Date.now();
  const modRes = await fetch(`${BASE}/api/moderator`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      brainDump: DEMO_BRAIN_DUMP,
      characters,
      sceneLabel: casting.scene_label,
    }),
  });
  const moderator = await modRes.json();
  console.log(`  ⏱ ${Date.now() - modStart}ms`);
  console.log(`  Best move: ${moderator.best_move}`);
  console.log(`  Can wait: ${moderator.can_wait}`);
  console.log(`  Why this works: ${moderator.why_this_works}`);
  console.log(`  Do not do: ${moderator.do_not_do}`);
  console.log(`  Overreacting voice: ${moderator.overreacting_voice}`);
  console.log(`  Scene insight: ${moderator.scene_insight}`);
  console.log(`  Action: ${moderator.action_type} → ${moderator.action_draft}`);

  // Step 4: Follow-up with first character
  const firstChar = characters[0];
  console.log(`\n💬 Calling /api/followup with ${firstChar.name}...`);
  const followStart = Date.now();
  const followRes = await fetch(`${BASE}/api/followup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sceneId: "test-scene",
      characterType: casting.characters[0].type,
      originalLine: firstChar.line,
      messages: [{ role: "user", content: "I hear you, but I really can't deal with that right now." }],
    }),
  });
  const followup = await followRes.json();
  console.log(`  ⏱ ${Date.now() - followStart}ms`);
  console.log(`  ${firstChar.emoji} Reply: ${followup.reply}`);

  // Summary
  const totalMs = Date.now() - totalStart;
  console.log("\n" + "=".repeat(60));
  console.log(`✅ Full scene complete in ${totalMs}ms (${(totalMs / 1000).toFixed(1)}s)`);
  console.log("=".repeat(60));
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
