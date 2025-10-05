// Simulate daily scripture or quote
function getDailyQuote() {
  // In real implementation, fetch from API
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        text: "Faith is taking the first step even when you don’t see the whole staircase.",
        author: "Martin Luther King Jr."
      });
    }, 500);
  });
}

async function displayDailyQuote() {
  const quote = await getDailyQuote();
  const quoteText = document.getElementById("quote-text");
  const quoteAuthor = document.getElementById("quote-author");
  quoteText.textContent = quote.text;
  quoteAuthor.textContent = "- " + quote.author;
}
