<template>
  <v-container>
    <v-layout text-xs-center wrap>
      <v-flex xs12>
        <v-card>
          <v-alert :value="error" type="error">
            {{error}}
            <v-btn color="warning" @click="error = null">x</v-btn>
          </v-alert>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">
                <strong>Name:</strong>
                {{ client.name }} /
                <strong>Registered at :</strong>
                {{ client.registeredAt }}
              </h3>
              <div></div>
            </div>
          </v-card-title>
        </v-card>
        <v-tabs v-model="active" dark>
          <v-tab :key="1" ripple>Available books</v-tab>
          <v-tab :key="2" ripple>Taken books</v-tab>
          <v-tab-item :key="1">
            <v-card flat>
              <v-card-text>
                <v-list two-line subheader>
                  <v-list-tile avatar v-for="book in availableBooks" :key="book.id">
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
                    <v-list-tile-action>
                      <v-checkbox v-model="toTake" :value="book.id"></v-checkbox>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
                <v-btn color="info" @click="takeBooks">take</v-btn>
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item :key="2">
            <v-card flat>
              <v-card-text>
                <v-list two-line subheader>
                  <v-list-tile avatar v-for="book in client.books" :key="book.id">
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
                        >{{ author.name}} {{author.surname}} /</span>
                      </v-list-tile-sub-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-checkbox v-model="toReturn" :value="book.id"></v-checkbox>
                    </v-list-tile-action>
                  </v-list-tile>
                </v-list>
                <v-btn color="info" @click="returnBooks">return</v-btn>
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
  AVAILABLE_BOOKS_QUERY,
  CLIENT_QUERY,
  TAKE_BOOKS,
  RETURN_BOOKS
} from "../constants/graphql";

export default {
  data() {
    return {
      active: 0,
      availableBooks: [],
      client: {
        name: null
      },
      toTake: [],
      toReturn: [],
      error: null
    };
  },
  async created() {
    await this.$apollo.queries.availableBooks.refetch();
    await this.$apollo.queries.client.refetch();
  },
  apollo: {
    availableBooks: {
      query: AVAILABLE_BOOKS_QUERY
    },
    client: {
      query: CLIENT_QUERY
    }
  },
  methods: {
    async takeBooks() {
      await this.$apollo
        .mutate({
          mutation: TAKE_BOOKS,
          variables: {
            ids: this.toTake
          }
        })
        .catch(e => {
          this.error = e.message;
        });
      await this.$apollo.queries.availableBooks.refetch();
      await this.$apollo.queries.client.refetch();
    },
    async returnBooks() {
      await this.$apollo.mutate({
        mutation: RETURN_BOOKS,
        variables: {
          ids: this.toReturn
        }
      });
      await this.$apollo.queries.availableBooks.refetch();
      await this.$apollo.queries.client.refetch();
    }
  }
};
</script>
