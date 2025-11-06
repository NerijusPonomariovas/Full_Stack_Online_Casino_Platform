import clsx from "clsx";
// Ensure the paths are correct based on your directory structure
import fish from "../images/dead.png"; // Check if this file exists
import treat from "../images/alive.png"; // Check if this file exists

const Cell = ({ cell }) => {
    return (
        <div className={clsx("cell", { "mine": cell.value === 'mine' })}>
            {cell.value === 'mine' && <img src={fish}/>}
            {cell.value === 'treat' && <img src={treat} />} 
        </div>
    )
}
export default Cell;