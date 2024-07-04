# Munch Recipes 2.0

[MUNCH LIVE URL](https://muncher2.vercel.app)

Purpose: Enter a youtube URL, get the ingredients and instructions within seconds. No need to pause and scrub through the video!

You can even filter the recipes list to suit your own food or allergy preferences! Dark mode is supported with MUI.

![chicken](chicken.png)

Limitations: Videos over 6-7 minutes overflow `openhermes` context and prompt instructions break during output. Submit a PR if you figured out a way around this!

## Sample Run Output (Make sure the recipe has subtitles!)

```bash
./process_json.sh https://youtu.be/4Qtmz1FDww0
Extracted video ID: 4Qtmz1FDww0
Working with video ID: 4Qtmz1FDww0
Fetching metadata for video ID: 4Qtmz1FDww0
Metadata saved to 4Qtmz1FDww0__meta.json
Using English subtitles.
Extracting: [[{'duration': 3.539,
   'start': 0.99,
   'text': 'Lo mein is another one of my all-time\nfavorite chinese meals.'},
  ...
  {'duration': 0.931, 'start': 278.289, 'text': 'Much Love!'}]]
Subtitles saved to JSON file: 4Qtmz1FDww0.json
Subtitles content saved to text file: 4Qtmz1FDww0__subtitles.txt
Payload saved to 4Qtmz1FDww0__payload.json
Processed content saved to 4Qtmz1FDww0__payload__output.json
Valid JSON output in 4Qtmz1FDww0__payload__output.json
{'ingredients': ['Lo Mein noodles', 'Lo Mein noodles (alternative: spaghetti, linguine or fettuccine)', 'garden onions', 'celery', 'carrots', '(optional) sliced cabbage or napa cabbage', 'bok choy (both bottom and tops)', 'oil', 'garlic', 'ginger', 'bamboo shoots', 'green onions', 'soy sauce', '(alternative to mushroom dark soy sauce) dark soy sauce', 'oyster sauce', 'chicken broth (or water or vegetable broth)', 'white pepper', 'sesame oil'], 'instructions': ['1. Buy Lo Mein noodles at local Asian grocery store or use alternative pasta.', '2. Cut noodles in half for easier cooking and eating.', '3. Prep vegetables into matchstick size pieces (alternative: sliced cabbage or napa cabbage).', '4. Make the sauce using soy sauce, mushroom dark soy sauce, oyster sauce, chicken broth, white pepper, and sesame oil.', '5. Heat oil in wok on medium-high heat and add whites of garden onions, minced garlic, and ginger.', '6. Add more vegetables (carrots, celery, bok choy bottoms) and stir constantly.', '7. Add bamboo shoots and cook for another 1 to 2 minutes.', '8. Add the tops of bok choy and green onions.', '9. Divide cooked noodles into two portions and add half of the sauce to one portion.', '10. Toss everything together in wok until well combined.', '11. For the second batch, add bean sprouts and any meat (optional).', '12. Cook according to taste preferences (add sugar for a sweeter Lo Mein).', '13. Serve and enjoy!'], 'title': 'Vegetable Lo Mein Recipe', 'chefTips': ['1. Find the middle of the noodles and cut them in half.', '2. Use mushroom dark soy sauce for a smoky hint of flavor.', '3. Stir constantly to cook vegetables evenly and quickly.', '4. Adjust sauce to taste preferences (e.g., add sugar for sweetness).', '5. Make it your own by adding your favorite ingredients.'], 'culture': 'Chinese', 'isGlutenFree': False, 'isVegan': False, 'isLactoseFree': True, 'isVegetarian': True, 'isKosher': False, 'isKeto': False, 'isLowCarb': False, 'isDairyFree': True, 'id': '4Qtmz1FDww0__payload_', 'rawSubtitles': 'Lo mein is another one of my all-time\\nfavorite chinese meals., "It is so quick, easy and delicious! Im\\n" Tess and welcome to my kitchen., , I buy my Lo Mein noodles at my local\\nAsian grocery store., "I buy them frozen and thaw when Im\\n" ready. This is a pound of Lo Mein noodles., They come in very long strands so I\\n tried to find the middle and cut them in, "half so theyre more cooking and eating\\nfriendly.", Lo Mein noodles are an egg noodle so\\n "they wont take long to cook. Only about", "four to five minutes then im going to\\n" drain and rinse with cold water to stop, the cooking process., You can add a little oil at this point\\n to keep the strands separated but, I find, just a little fluff every now and then\\ndoes the trick., "If you cant find Lo Mein noodles you\\n" can also use a pasta like spaghetti,, linguine or fettuccine., This is another stir fry so you want to\\n have everything prepped and ready to go, "before cooking. Tonight Im using some\\n" garden onions and I just love celery and, carrots in my Lo Mein., I usually use sliced cabbage or napa\\ncabbage but, I only had bok choy. So, I am using both the bottom and the tops., Basically, I use what I have on hand. I am\\n cutting the veggies into matchstick size, pieces so they cook fast and mix well\\nwith the Lo Mein., And now for the sauce! Of course we have to start with some soy sauce and this is, my little secret to a good Lo Mein., "Ive made a lot of Lo Mein over the\\n" years and i found using this mushroom, dark soy sauce will give the Lo Mein\\n that smoky hint of flavor. You can use, just a dark soy sauce but i find it does\\n not taste the same. Also going in with, some oyster sauce and some chicken broth., You can also use water or vegetable\\n broth. Adding a little bit of white pepper and a, drizzle of sesame oil. Giving that a good\\n whisk and setting to the side., You can find this recipe and the list of\\n ingredients in the description box below., "I think were finally ready for the fun\\n" "part and were going to be eating in 10", minutes!, "In my wok on medium-high im adding a\\ncouple tablespoons of oil,", the whites of garden onions, minced\\n garlic and ginger. Giving that a good, stir for about 30 seconds and then we\\nwill add more veggies., Turning my heat up to high and in goes\\n my carrots, celery and the bottoms of my, bok choy. Going to stir constantly and\\n cook for about two minutes., This goes quickly!, If you like this Lo Mein recipe video\\n please remember to give me a Thumbs Up,, Subscribe and leave a Comment below. You\\n "can also find me and more of what Im", cooking on Facebook and Tess Cooks4u blog., Next are the bamboo shoots that I rinsed\\n really well and drained. Stirring and, cooking for another one to two minutes., Here are the tops to the bok choy and\\nthe green onions., "This is half of the pound of Lo Mein. Im\\ndividing it into two.", It makes it easier to handle in the\\n wok. In goes half of the sauce I made, "and Im saving the other half for the\\nnext round of Lo Mein.", I wish you could smell this! Giving this\\n a good toss to make sure everything is, "well combined and its ready to serve!", I find that some put sugar in their Lo\\n "Mein sauce to sweeten. We dont like our", Lo Mein sweet but you can adjust to your\\ntaste., "My second batch of Lo Mein Im adding\\n" one of my favorites and that is, bean sprouts., I love the texture and the crunch they\\ngive the Lo Mein., This is a vegetable Lo Mein but you can\\nadd any meat., Make it your own! We just love Lo Mein\\n and it is a frequent meal at our home., An inexpensive meal that is healthier\\n than takeout, easy to make and,, absolutely delicious!, A great way to use leftover vegetables!, It is a win-win meal every way., I hope you give this Lo Mein recipe a\\n try. Tell me in the comments section, below how you like your Lo Mein. And\\nuntil next time, enjoy., And Thanks so much for joining me here\\nin my kitchen., You can subscribe here for my future\\n video recipes and remember to come visit, me on Facebook., You never know what i might be cooking!\\nUntil next time,, Much Love!', 'sourceUrl': 'https://youtu.be/4Qtmz1FDww0__payload_', 'isSubtitlesProcessed': True, 'isNeedsReview': False, '$id': '6686df1a003d8cebf5d6', '$permissions': [], '$createdAt': '2024-07-04T17:42:47.123+00:00', '$updatedAt': '2024-07-04T17:42:47.123+00:00', 'modelUsed': None, 'enSubtitles': None, 'sourceLanguage': None, 'image': None, 'markdownData': None, 'totalTimeMinutes': None, 'score': None, '$databaseId': '66809ec600037781f0e8', '$collectionId': '6681b9460039488df332'}
Temporary files removed.
Subtitle extraction and translation took: 2 seconds
Sending payload and receiving response took: 34 seconds
Total script execution time: 39 seconds
```

## Installation

```bash
pnpm i
pnpm start
```

### Connect Appwrite

Add credentials to `env.sample` and rename to `.env`

### Server Install

```bash
wget https://ollama.ai/install.sh
sh ./install.sh
ollama run openhermes
# `ollama run qwen2:0.5b` on lower RAM systems
systemctl edit ollama.service

# Add this to allow remote connections
[Service]
Environment="OLLAMA_HOST=0.0.0.0"

systemctl restart ollama.service
```

## Updating

```bash
pnpm upgrade
```

<!-- ## TODO -->

<!-- - Finalize IRecipe -->
<!-- - Provisioning script for Appwrite Recipes model -->

<!-- - Load Data with this nice card layout https://demos.themeselection.com/materio-mui-nextjs-admin-template-free/demo/card-basic -->
  <!-- - Recipe "details" page -->
  <!-- - Search / filtering functionality (culture) -->
  <!-- - Submit your URL to queue -->
  <!-- - Appwrite processing on server -->
  <!-- Clicking on the queue item should run the ETL script and update appwrite -->
<!-- dark mode -->
