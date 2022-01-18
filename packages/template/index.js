import ReactDOM from "react-dom";
import styles from "./home.module.css";

const App = () => {
  return (
    <div className={styles.container}>
      <h1>Hello World</h1>
    </div>
  );
};
ReactDOM.render(<App />, document.getElementById("root"));
