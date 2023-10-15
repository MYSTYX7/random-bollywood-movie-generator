import { promises as fs } from "fs";
import { cwd } from "process";

export default async function Movies() {
  const file = await fs.readFile(process.cwd() + "/src/app/data.json", "utf8");
  const movies = JSON.parse(file);

  return (
    <div>
      {movies.map((movie) => {
        return (
          <div key={movie.id}>
            <p>{movie.title}</p>
          </div>
        );
      })}
    </div>
  );
}
