<template>
  <v-container>
    <v-layout text-xs-center wrap>
      <v-flex xs12>
        <v-alert :value="error" type="error">
          {{error}}
          <v-btn color="warning" @click="error = null">x</v-btn>
        </v-alert>
        <v-tabs v-model="active" dark>
          <v-tab :key="1" ripple>Books</v-tab>
          <v-tab :key="2" ripple>Authors</v-tab>
          <v-tab-item :key="1">
            <v-card flat>
              <v-card-text>
                <v-list two-line subheader>
                  <v-list-tile avatar v-for="book in books" :key="book.id">
                    <v-list-tile-content>
                      <v-list-tile-title>
                        <strong>{{ book.title }}</strong>
                        / released at {{ book.releasedAt }}
                      </v-list-tile-title>
                      <v-list-tile-sub-title>
                        Authors:
                        <span
                          v-for="author in book.authors"
                          :key="author.name"
                        >{{ author.name}} {{author.surname}} ({{ author.birthYear }}) /</span>
                      </v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
                <v-divider></v-divider>
                <v-container>
                  <v-form>
                    <h2>add new book</h2>
                    <v-flex xs12 sm6 md4>
                      <v-text-field label="title" v-model="book.title" outline></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <v-menu
                        v-model="menuBook"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px"
                      >
                        <v-text-field
                          slot="activator"
                          v-model="book.releasedAt"
                          label="Picker in menu"
                          prepend-icon="event"
                          readonly
                        ></v-text-field>
                        <v-date-picker
                          v-model="book.releasedAt"
                          @input="menuBook = false"
                          no-title
                          scrollable
                        ></v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex xs12 sm6>
                      <v-select
                        v-model="book.authors"
                        :items="authors"
                        item-text="surname"
                        item-value="id"
                        chips
                        label="authors"
                        multiple
                        outline
                      ></v-select>
                    </v-flex>
                    <v-btn color="info" @click="addBook">add</v-btn>
                  </v-form>
                </v-container>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item :key="2">
            <v-card flat>
              <v-card-text>
                <v-list two-line subheader>
                  <v-list-tile avatar v-for="author in authors" :key="author.id">
                    <v-list-tile-content>
                      <v-list-tile-title>
                        <strong>{{ author.name }} {{ author.surname }}</strong>
                        / birth year {{ author.birthYear }}
                      </v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
                <v-divider></v-divider>
                <h2>add author</h2>
                <v-container>
                  <v-form>
                    <v-flex xs12 sm6>
                      <v-text-field label="name" v-model="author.name" outline></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6>
                      <v-text-field label="surname" v-model="author.surname" outline></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6>
                      <v-text-field label="birth year" v-model="author.birthYear" outline></v-text-field>
                    </v-flex>
                    <v-btn color="info" @click="addAuthor">add</v-btn>
                  </v-form>
                </v-container>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import {
  BOOKS_QUERY,
  AUTHORS_QUERY,
  ADD_BOOK,
  ADD_AUTHOR
} from "../constants/graphql";
export default {
  data() {
    return {
      active: 0,
      menuBook: false,
      book: {
        title: null,
        releasedAt: null,
        authors: []
      },
      author: {
        name: null,
        surname: null,
        birthYear: null
      },
      error: null
    };
  },
  methods: {
    async addBook() {
      await this.$apollo
        .mutate({
          mutation: ADD_BOOK,
          variables: {
            book: this.book
          }
        })
        .catch(e => {
          this.error = e.message;
        });
      this.book = {
        title: null,
        releasedAt: null,
        authors: []
      };
      await this.$apollo.queries.books.refetch();
    },
    async addAuthor() {
      const { name, surname, birthYear } = this.author;
      await this.$apollo
        .mutate({
          mutation: ADD_AUTHOR,
          variables: {
            author: {
              name,
              surname,
              birthYear: parseInt(birthYear)
            }
          }
        })
        .catch(e => {
          this.error = e.message;
        });
      this.author = {
        name: null,
        surname: null,
        birthYear: null
      };
      await this.$apollo.queries.authors.refetch();
    }
  },
  apollo: {
    books: {
      query: BOOKS_QUERY
    },
    authors: {
      query: AUTHORS_QUERY
    }
  }
};
</script>
