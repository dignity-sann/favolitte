<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Manage - group</h1>
        <div>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cupiditate vitae illo inventore maiores quod architecto eius tempore quis alias, earum fugiat dolor neque blanditiis iusto ratione harum modi. Necessitatibus dignissimos beatae, corporis eum repellat exercitationem libero excepturi vero voluptas, voluptatem esse. Ipsum labore necessitatibus libero adipisci, doloremque cumque cum, ad dolores vitae ipsam, eius voluptatum repudiandae pariatur nihil nostrum. Perspiciatis, repellendus optio. Animi molestias ratione eligendi fuga qui voluptatem adipisci, cumque aliquid accusantium aliquam. Eos eum voluptate quaerat placeat tenetur ab pariatur dolore saepe, facere soluta doloribus molestiae similique, esse adipisci, in ipsum ullam. Quibusdam quas adipisci ea sit? Molestiae eligendi assumenda dolorem fugiat magni nisi suscipit, et consectetur architecto. Odit facere reprehenderit esse sapiente praesentium neque placeat nulla iusto velit ut. Quaerat dolor esse veritatis suscipit exercitationem voluptatibus, ex aperiam nostrum libero maxime ad! Maiores ipsa quia exercitationem earum voluptates, impedit ad qui, omnis itaque distinctio mollitia aliquam atque corporis delectus minus quod harum magnam laudantium perferendis aliquid! Consectetur natus deserunt quas eius minima vel debitis repudiandae doloribus non, cum exercitationem cupiditate veniam quia molestiae? Tempora amet, nisi reiciendis voluptatum in quibusdam necessitatibus ad nulla rerum optio fuga praesentium est, libero iste nihil saepe minus repellendus culpa consequatur quo!</div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <h3>Create group</h3>
        <form>
          <v-text-field
            v-model="groupName"
            :error-messages="nameErrors"
            :counter="10"
            label="Group name"
            required
            @input="$v.name.$touch()"
            @blur="$v.name.$touch()"
          ></v-text-field>
          <v-btn class="primary" @click="create" :rounded="true">create</v-btn>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      nameErrors: '',
      groupName: '',
    }
  },
  methods: {
    create: () => {
      // do something
    }
  }
};
</script>
