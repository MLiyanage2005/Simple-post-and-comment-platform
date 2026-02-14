import sqlalchemy
import databases

from config import config

metadata = sqlalchemy.MetaData()

post_table = sqlalchemy.Table(
    "post",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("body", sqlalchemy.String, nullable=False),
)
user_table = sqlalchemy.Table(
    "users", metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
     sqlalchemy.Column("email", sqlalchemy.String, nullable=False),
     sqlalchemy.Column("password", sqlalchemy.String, nullable=False),


comment_table = sqlalchemy.Table(
    "comment",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("body", sqlalchemy.String, nullable=False),
    sqlalchemy.Column(
        "post_id",
        sqlalchemy.Integer,
        sqlalchemy.ForeignKey("post.id"),
        nullable=False,
    ),
))

engine = sqlalchemy.create_engine(config.DATABASE_URL)

metadata.create_all(engine)

database = databases.Database(config.DATABASE_URL)
