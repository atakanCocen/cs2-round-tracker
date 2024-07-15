print('Started adding users');

db.createUser(
    {
        user: "admin",
        pwd: "password",
        roles: [
            {
                role: "root",
                db: "admin"
            },
            {
                role: "readWrite",
                db: "cs2"
            }
        ]
    }
);

print('Completed adding users');