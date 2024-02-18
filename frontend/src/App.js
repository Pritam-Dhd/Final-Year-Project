import Routex from "./Components/Routex";
import { UserRoleProvider } from "./Components/UserContext";

function App() {
  return (
    <div className="App">
      <UserRoleProvider>
        <Routex />
      </UserRoleProvider>
    </div>
  );
}

export default App;
