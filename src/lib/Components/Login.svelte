<script>
    const app = new Realm.App({ id: roadwise-geobi});






    async function loginEmailPassword(email, password) {
        // Create an email/password credential
        const credentials = Realm.Credentials.emailPassword(email, password);

        // Authenticate the user
        const user = await app.logIn(credentials);
        // `App.currentUser` updates to match the logged in user
        console.assert(user.id === app.currentUser.id);

        return user;
    }

    const user = loginEmailPassword("joe.jasper@example.com", "passw0rd");

</script>
