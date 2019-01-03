/**
 * Class representing a board cell
 */
class MyCell extends MyComponent {

  constructor(scene, id) {
    super(scene, id)
    this.getCoordinates()
    this.highlighted = false;
  }

  getCoordinates() {
    let values = parseInt(this.id.replace(/\D/g, ''))
    this.row = Math.floor(values / 10)
    this.col = values % 10
  }

  setHighlited(highlighted) {
    this.highlighted = highlighted;
  }

  display(mat,tex,display) {
    // Sets highlighting shader active
    if(this.highlighted)
      if(!display)
        return;
    
    super.display(mat,tex);
  }
}