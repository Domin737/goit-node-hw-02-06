use db-contacts;

// Nowe ID właściciela
const newOwnerId = ObjectId("66ce64d383d14af77b30bd4c");

// Stare ID właściciela
const oldOwnerId = ObjectId("66cbdf56aef16c86669793c0");

// Aktualizacja wszystkich kontaktów, które mają stare ID właściciela
db.contacts.updateMany(
  { owner: oldOwnerId },
  { $set: { owner: newOwnerId } }
);

// Sprawdź, czy operacja się powiodła, wyświetlając zaktualizowane dokumenty
db.contacts.find({ owner: newOwnerId }).pretty();
