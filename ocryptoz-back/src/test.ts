
abstract class Master {

    
    public findAll(): void {
        console.log('this', this)
        console.log('working')
    }
}

class Children extends Master {}

class Controller {
    children: Children = new Children();

    hey(): void {
        console.log('yo');
        
    }



}

const controller: Controller = new Controller()
 
controller.hey()






