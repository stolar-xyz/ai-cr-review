"use server";
import { AsyncDatabase } from "promised-sqlite3";
import { redirect } from "next/navigation";

export default async function updateUsername(formData) {
  console.log("updateUsername called", formData);

  const username = formData.get("username");
  const id = formData.get("id");

  const db = await AsyncDatabase.open("./notes.db");
  await db.run("UPDATE users SET name = ? WHERE id = " + id, [username]);
  redirect("/");
}
