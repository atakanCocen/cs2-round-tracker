echo '################ MONGO ENTRYPOINT START ################';
set -e
mongosh -- "$MONGO_INITDB_DATABASE" <<EOF

console.log('Creating db');

db.createCollection("$MONGO_INITDB_COLLECTION");
db.createCollection("$MONGO_USER_COLLECTION");

console.log('Completed creating db');
console.log('Started adding users');

db.createUser(
    {
        user: "$MONGO_INITDB_ROOT_USERNAME",
        pwd: "$MONGO_INITDB_ROOT_PASSWORD",
        roles: [
            {
                role: "root",
                db: "admin"
            },
            {
                role: "readWrite",
                db: "$MONGO_INITDB_DATABASE"
            }
        ]
    }
);

console.log('Completed adding users');

EOF