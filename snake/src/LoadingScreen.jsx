
import './LoadingScreen.css';
function LoadingScreen (props) {
  return (
    <div class = "loading">
    <h1>
    Loading...
    </h1>
<div class="loadingspinner">
  
  <div id="square1"></div>
  <div id="square2"></div>
  <div id="square3"></div>
  <div id="square4"></div>
  <div id="square5"></div>
</div>
</div>
  );
}

export default LoadingScreen;