import "./styles.css";
import { Book, BookInformation, Review, User } from "./lib/types";
import { getBooks, getUsers, getReviews } from "./lib/api";
import { useEffect, useState, FC } from "react";
import Card from "./Card";

const App: FC = () => {
  const [books, setBooks] = useState<BookInformation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      try {
        const fetchedBooks = await getBooks();
        const fetchedUsers = await getUsers();
        const fetchedReviews = await getReviews();

        const booksWithInfo = fetchedBooks.map((book) => {
          const author = fetchedUsers.find(
            (user) => user.id === book.authorId,
          ) || {
            id: "",
            name: "Неизвестный автор",
          };

          const reviews = book.reviewIds.map((reviewId) => {
            const review = fetchedReviews.find((r) => r.id === reviewId) || {
              id: "",
              text: "-",
              userId: "",
            };

            const user = fetchedUsers.find((u) => u.id === review.userId) || {
              id: "",
              name: "-",
            };

            return {
              id: review.id,
              text: review.text,
              user,
            };
          });

          return {
            ...book,
            author,
            reviews,
          };
        });

        setBooks(booksWithInfo);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div>
      <h1>Мои книги:</h1>
      {isLoading && <div>Загрузка...</div>}
      {!isLoading && books.map((b) => <Card key={b.id} book={b} />)}
    </div>
  );
};

export default App;
