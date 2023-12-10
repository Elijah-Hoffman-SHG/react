import BlockDescription from './Blockdescription';

function Dispbox({ color, score }) {
  return (
    <div className="nav">
     {<h2>Score: {score}</h2>}
      <BlockDescription color={color} />
      
    </div>
  );
}

export default Dispbox;