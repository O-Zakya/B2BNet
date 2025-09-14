/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('users', function(table) {
        table.increments('id').primary();
        table.string('first_name', 100).notNullable();
        table.string('last_name', 100).notNullable();
        table.string('job_title', 100).notNullable();
        table.string('email', 255).notNullable().unique();
        table.string('phone', 30).notNullable();
        table.string('country', 100);
        table.string('language', 50);
        table.string('password', 255).notNullable();
        table.string('profile_photo', 255);
        table.datetime('created_at').defaultTo(knex.fn.now());
        table.datetime('updated_at').defaultTo(knex.fn.now());
        table.boolean('email_verified').defaultTo(false);
        table.boolean('phone_verified').defaultTo(false);
  });
};
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
