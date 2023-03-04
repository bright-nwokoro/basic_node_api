export function up(db) {
    return db.collection("users").updateMany({}, { $set: { age: 0 } });
}
export function down(db) {
    return db.collection("users").updateMany({}, { $unset: { age: "" } });
}
