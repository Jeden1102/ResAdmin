<template>
  <div class="home">
    <h2>Home</h2>
    <p>An admin panel is a must-have for web applications like e-commerce projects or content management systems, known as CMSes. You can actually outsource the work of creating a web app to an agency like Quikclicks or build your own from scratch.
    These beautiful panels are full of features created to make your life easier. All are seamlessly coded and using the power of Vue to animate the panels. Whether you`re building a new app, a user account area or revamping an old admin panel, these ones are worth checking out.</p>
    Let's dive in to the product and read the manual to know all features:
    <b-card>
        <b-tabs pills card vertical>
      <b-tab title="Waiters" active><b-card-text>Waiter page is a place where you can add waiter, modify their details or delete them. On the top you can see waiters list displayed in a table, and below there is a form which you can use to add new waiter.</b-card-text></b-tab>
      <b-tab title="Menu"><b-card-text>This page is splitted on two tabs : Products tab is a place where you can add product, modify its details or delete it. On the top you can see products list displayed in a table, and below there is a form which you can use to add new product. In the other tab you can add, delete or modify new category.</b-card-text></b-tab>
      <b-tab title="Edit view"><b-card-text>Heart of our restaurant menagment system. It's a place where you can easilly control everything about the restaurant. On the top you can see a form with two inputs field with which you can easilly add new table to the view. Below you can see the whole view - click on a table an drag into another place, and the click "set" to save this table position. You can also save some views as a template by clicking "Save this view as template" button. When your view is empty - which means, there are no tables you can click "Load View" button and go back to some view you previously saved.
     </b-card-text></b-tab>
    <b-tab title="Profile"><b-card-text>This page is splitted on three tabs : profile tab is a place where you can easilly edit your profile details such as name,surname,email or set new profile image. Password is another tab where you can change your password - for doing that you have to know your current password, or ask manager to change it for you. Last tab - statistics is a plase where you can see some info about your work.
     </b-card-text></b-tab>
    </b-tabs>
    </b-card>

    </div>
</template>

<script>
export default {
  name: "Home",
  components: {},
};
</script>
