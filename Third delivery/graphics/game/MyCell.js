/**
 * Class representing a board cell
 */
class MyCell extends MyComponent {

  constructor(scene, id) {
    super(scene, id)
    this.getCoordinates()
    this.highlighted = false
  }

  getCoordinates() {
    let values = parseInt(this.id.replace(/\D/g, ''))
    this.row = Math.floor(values / 10)
    this.col = values % 10
  }

  display(mat,tex) {
    // Sets highlighting shader active
    //if (this.highlighted);
      //this.scene.setActiveShader(this.scene.shaders[0]);

    super.display(mat,tex);

    // Sets default shader
    //if (this.highlighted);
      //this.scene.setActiveShader(this.scene.defaultShader);
  }
}