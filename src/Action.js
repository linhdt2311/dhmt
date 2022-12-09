// export default class Experience {
// 	raycaster = new THREE.Raycaster();
// 	clickMouse = new THREE.Vector2();
// 	moveMouse = new THREE.Vector2();
// 	draggable;

//     constructor(){

//     }
	
// 	intersect(pos) {
// 		raycaster.setFromCamera(pos, camera);
// 		return raycaster.intersectObjects(scene.children);
// 	}
	
// 	window.addEventListener('click', event => {
// 		if (draggable != null) {
// 			console.log(`dropping draggable ${draggable.userData.name}`)
// 			draggable = null;
// 			return;
// 		}
	
// 		clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
// 		clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
	
// 		const found = intersect(clickMouse);
// 		console.log(found)
// 		if (found.length > 0) {
// 			if (found[0].object.userData.draggable) {
// 				draggable = found[0].object
// 				console.log(`found draggable ${draggable.userData.name}`)
// 			}
// 		}
// 	})
	
// 	window.addEventListener('mousemove', event => {
// 		moveMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
// 		moveMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
// 	});
	
// 	dragObject() {
// 		if (draggable != null) {
// 			const found = intersect(moveMouse);
// 			if (found.length > 0) {
// 				for (let i = 0; i < found.length; i++) {
// 					if (!found[i].object.userData.ground)
// 						continue
	
// 					let target = found[i].point;
// 					draggable.position.x = target.x
// 					draggable.position.z = target.z
// 				}
// 			}
// 		}
// 	}
// }