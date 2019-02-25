exports.up = async knex => {
  await knex.schema.createTable("clients", async t => {
    t.uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));
    t.string("name").notNullable();
    t.string("password").notNullable();
    t.date("registered_at")
      .notNullable()
      .defaultTo(knex.raw("now()"));
    t.string("photo");
    t.unique("name");
  });
  await knex.schema.createTable("books", async t => {
    t.uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));
    t.string("title").notNullable();
    t.date("released_at").notNullable();
  });
  await knex.schema.createTable("authors", async t => {
    t.uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));
    t.string("name").notNullable();
    t.string("surname").notNullable();
    t.integer("birth_year").notNullable();
  });
  await knex.schema.createTable("books_authors", async t => {
    t.uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));
    t.uuid("book_id");
    t.uuid("author_id");
    t.foreign("book_id").references("books.id");
    t.foreign("author_id").references("authors.id");
  });
  await knex.schema.createTable("clients_books", async t => {
    t.uuid("id")
      .primary()
      .defaultTo(knex.raw("gen_random_uuid()"));
    t.uuid("book_id");
    t.uuid("client_id");
    t.foreign("book_id").references("books.id");
    t.foreign("client_id").references("clients.id");
    t.unique("book_id");
  });
  await knex.schema.raw(`
    CREATE OR REPLACE VIEW books_with_authors
    AS SELECT books.id,
        books.title,
        books.released_at,
        json_agg(authors.*) FILTER (WHERE authors.id IS NOT NULL) AS authors
      FROM books
        LEFT JOIN books_authors ba ON ba.book_id = books.id
        LEFT JOIN authors ON ba.author_id = authors.id
      GROUP BY books.id;
  `);
  await knex.schema.raw(`
    CREATE OR REPLACE VIEW authors_with_books
    AS SELECT authors.id,
        authors.name,
        authors.surname,
        authors.birth_year,
        json_agg(books.*) FILTER (WHERE books.id IS NOT NULL) AS books
      FROM authors
        LEFT JOIN books_authors ba ON ba.author_id = authors.id
        LEFT JOIN books ON ba.book_id = books.id
      GROUP BY authors.id;
  `);
  await knex.schema.raw(`
    CREATE OR REPLACE VIEW clients_with_books
    AS SELECT clients.id,
        clients.name,
        clients.password,
        clients.registered_at,
        clients.photo,
        json_agg(bwa.*) FILTER (WHERE bwa.id IS NOT NULL) AS books
      FROM clients
        LEFT JOIN clients_books cb ON cb.client_id = clients.id
        LEFT JOIN books_with_authors bwa ON bwa.id = cb.book_id
      GROUP BY clients.id;
  `);
  await knex.schema.raw(`
      CREATE OR REPLACE VIEW available_books
    AS SELECT bwa.id,
        bwa.title,
        bwa.released_at,
        bwa.authors
      FROM books_with_authors bwa
        LEFT JOIN clients_books cb ON bwa.id = cb.book_id
      WHERE cb.book_id IS NULL;
`);
};

exports.down = async knex => {
  await knex.schema.raw("DROP VIEW IF EXISTS available_books;");
  await knex.schema.raw("DROP VIEW IF EXISTS clients_with_books;");
  await knex.schema.raw("DROP VIEW IF EXISTS books_with_authors;");
  await knex.schema.raw("DROP VIEW IF EXISTS authors_with_books;");
  await knex.schema.dropTable("books_authors");
  await knex.schema.dropTable("clients_books");
  await knex.schema.dropTable("books");
  await knex.schema.dropTable("authors");
  await knex.schema.dropTable("clients");
};
