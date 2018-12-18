/**
 * Class representing a board cell
 */
class MyCell extends MyComponent {

  constructor(scene, x, y) {
    super(scene)
    this.x = x
    this.y = y
    this.highlighted = false;
  }

  display() {
    // Sets highlighting shader active
    if (this.highlighted)
      this.scene.setActiveShader(this.scene.shaders[0]);

    super.display();

    // Sets default shader
    if (this.highlighted)
      this.scene.setActiveShader(this.scene.defaultShader);
  }
}