import { useState } from "react";
import Navbar from "../components/Navbar";
import OperationHeader from "../components/OperationHeader";
import OperationList from "../components/OperationList";

const Home = () => {
    const [operations, setOperations] = useState([]);

    return (
        <div>
            <Navbar />
            <OperationHeader
                onOperationCreated={(newOp) => setOperations((prev) => [newOp, ...prev])}
            />

            <OperationList
                operations={operations}
                setOperations={setOperations}
            />

        </div>
    );
};

export default Home;