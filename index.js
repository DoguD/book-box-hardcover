require("dotenv").config();
const { Octokit } = require("@octokit/rest");
const wordwrap = require("wordwrap");
const got = require('got');

const {
  GIST_ID: gistId,
  GH_TOKEN: githubToken,
  HARDCOVER_KEY: hardcoverKey,
} = process.env;

const octokit = new Octokit({
  auth: `token ${githubToken}`
});

// Function to fetch recently read book from Hardcover API
async function fetchRecentlyReadFromHardcover() {
  const query = `
    query RecentlyReadQuery {
      me {
        user_books(
          where: {status_id: {_eq: 3}}
          order_by: {last_read_date: desc_nulls_last}
          limit: 1
        ) {
          book {
            cached_contributors
            title
          }
        }
      }
    }
  `;

  try {
    const response = await got.post('https://api.hardcover.app/v1/graphql', {
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${hardcoverKey}`
      },
      json: {
        query: query
      }
    }).json();

    const userData = response?.data?.me?.[0];
    const recentBook = userData?.user_books?.[0]?.book;
    
    if (recentBook) {
      const title = recentBook.title;
      const author = recentBook.cached_contributors?.[0]?.author?.name;
      
      return {
        title: title,
        author: author
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching from Hardcover:', error.message);
    return null;
  }
}

// Function to fetch currently reading book from Hardcover API
async function fetchCurrentlyReadingFromHardcover() {
  const query = `
    query CurrentlyReadingQuery {
      me {
        user_books(
          where: {status_id: {_eq: 2}}
          order_by: {updated_at: desc_nulls_last}
          limit: 1
        ) {
          book {
            cached_contributors
            title
          }
        }
      }
    }
  `;

  try {
    const response = await got.post('https://api.hardcover.app/v1/graphql', {
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${hardcoverKey}`
      },
      json: {
        query: query
      }
    }).json();

    const userData = response?.data?.me?.[0];
    const currentBook = userData?.user_books?.[0]?.book;
    
    if (currentBook) {
      const title = currentBook.title;
      const author = currentBook.cached_contributors?.[0]?.author?.name;
      
      return {
        title: title,
        author: author
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching currently reading from Hardcover:', error.message);
    return null;
  }
}

async function main() {
  const wrap = wordwrap(50);

  try {
    // Get and parse recently read book from Hardcover
    const recentlyReadFromHardcover = await fetchRecentlyReadFromHardcover();

    const recentlyRead = recentlyReadFromHardcover && recentlyReadFromHardcover.title && recentlyReadFromHardcover.author
      ? `Recently read:\n${recentlyReadFromHardcover.title.split(':')[0]} by ${recentlyReadFromHardcover.author}`
      : `I haven't read anything recently.`
    
    // Get and parse currently reading book from Hardcover
    const currentlyReadingFromHardcover = await fetchCurrentlyReadingFromHardcover();

    const currentlyReading = currentlyReadingFromHardcover && currentlyReadingFromHardcover.title && currentlyReadingFromHardcover.author
      ? `Currently reading:\n${currentlyReadingFromHardcover.title.split(':')[0]} by ${currentlyReadingFromHardcover.author}\n`
      : `I'm not reading anything at the moment.\n`
    
    // Update your gist
    await updateGist([wrap(currentlyReading), wrap(recentlyRead), '\n']);
  } catch (error) {
    console.error(`Unable to fetch books from Hardcover\n${error}`)
  }
}

async function updateGist(readingStatus) {
  

  let gist;
  try {
    gist = await octokit.gists.get({ gist_id: gistId });
  } catch (error) {
    console.error(`Unable to get gist\n${error}`);
  }

  // Get original filename to update that same file
  const filename = Object.keys(gist.data.files)[0];

  // Only update if the content has changed
  if (gist.data.files[filename].content === readingStatus.join('\n')) {
    console.log(`Reading status hasn't changed; skipping update.`);
    return;
  }

  try {
    await octokit.gists.update({
      gist_id: gistId,
      files: {
        [filename]: {
          filename,
          content: readingStatus.join('\n'),
        }
      }
    });
  } catch (error) {
    console.error(`Unable to update gist\n${error}`);
  }
}

(async () => {
  await main();
})();
