exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("id").primary(); // Primary key: Auto-incremented user ID
      table.string("name").notNullable(); // User's name
      table.bigInteger("balance").notNullable().defaultTo(0); // Balance in cents
      table.timestamps(true, true); // Created at and updated at timestamps
    })
    .createTable("transactions", (table) => {
      table.increments("id").primary(); // Primary key: Auto-incremented transaction ID
      table
        .integer("sender_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE"); // Sender ID
      table
        .integer("receiver_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE"); // Receiver ID
      table.bigInteger("amount").notNullable(); // Transaction amount in cents
      table.timestamps(true, true); // Created at and updated at timestamps
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("transactions")
    .dropTableIfExists("users");
};
