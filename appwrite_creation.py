import os
from dotenv import load_dotenv 
from time import sleep
import time
from functools import wraps

from appwrite.client import Client
from appwrite.services.users import Users
from appwrite.services.databases import Databases
from appwrite.services.storage import Storage
# from appwrite.services.account import Account
from appwrite.services.functions import Functions
# from appwrite.input_file import InputFile
from appwrite.permission import Permission
from appwrite.role import Role
from appwrite.id import ID

def time_tracker(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()  # Record the start time
        result = func(*args, **kwargs)  # Call the function
        end_time = time.time()  # Record the end time
        print(f"{func.__name__} executed in {end_time - start_time:.4f} seconds.")
        return result
    return wrapper


load_dotenv()

# Helper method to print green colored output.
def p(info):
    print("\033[32;1m"+str(info)+"\033[0m")

client = Client()
client.set_endpoint(os.getenv('NEXT_PUBLIC_APPWRITE_ENDPOINT')) # Your API Endpoint
client.set_project(os.getenv('NEXT_PUBLIC_APPWRITE_PROJECT_ID')) # Your project ID
client.set_key(os.getenv('APPWRITE_API_KEY')) # Your secret API key

databases = Databases(client)
storage = Storage(client)
functions = Functions(client)
users = Users(client)

document_id = None
user_id = None
bucket_id = os.getenv('APPWRITE_RECIPES_BUCKET_ID')
database_id = os.getenv("NEXT_PUBLIC_APPWRITE_DATABASE_ID")
collection_id = os.getenv('NEXT_PUBLIC_APPWRITE_RECIPES_COLLECTION_ID')

file_id = None
document_id = None
@time_tracker
def create_recipes_collection():
    try:
        response = databases.create_collection(
            database_id=database_id,
            collection_id=ID.unique(),
            name="Recipes",
            document_security=True,
            permissions=[
                Permission.read(Role.any()),
                Permission.create(Role.users()),
                Permission.update(Role.users()),
                Permission.delete(Role.users()),
            ]
        )
        p("Collection created successfully")
        return response['$id']
    except Exception as e:
        print(f"Error creating collection: {e}")
        return None

@time_tracker
def create_attributes(collection_id):
    attributes = [
        ("id", "integer"),
        ("title", "string"),
        ("rawSubtitles", "string20000"),
        ("modelUsed", "string"),
        ("enSubtitles", "string20000"),
        ("ingredients", "string"),
        ("instructions", "string"),
        ("sourceUrl", "string"),
        ("sourceLanguage", "string"),
        ("image", "string"),
        ("markdownData", "string20000"),
        ("chefTips", "string"),
        ("culture", "string"),
        ("totalTimeMinutes", "integer"),
        ("isSubtitlesProcessed", "boolean"),
        ("isGlutenFree", "boolean"),
        ("isVegan", "boolean"),
        ("isLactoseFree", "boolean"),
        ("isVegetarian", "boolean"),
        ("isKosher", "boolean"),
        ("isKeto", "boolean"),
        ("isLowCarb", "boolean"),
        ("isDairyFree", "boolean"),
        ("isNeedsReview", "boolean"),
        ("score", "integer")
    ]
    
    for attr in attributes:
        try:
            if attr[1] == "integer":
                databases.create_integer_attribute(database_id, collection_id, attr[0], False)
            elif attr[1] == "string":
                default = attr[2] if len(attr) > 2 else None
                databases.create_string_attribute(database_id, collection_id, attr[0], 255, required=False, default=default)
            elif attr[1] == "string20000":
                default = attr[2] if len(attr) > 2 else None
                databases.create_string_attribute(database_id, collection_id, attr[0], 20000, required=False, default=default)
            elif attr[1] == "boolean":
                databases.create_boolean_attribute(database_id, collection_id, attr[0], False)
            p(f"Attribute {attr[0]} created successfully")
        except Exception as e:
            print(f"Error creating attribute {attr[0]}: {e}")

collection_id = create_recipes_collection()
create_attributes(collection_id)