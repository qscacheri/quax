import 
{
    ADD_OBJECT,
    UPDATE_OBJECT,
    ADD_PATCH_CABLE,
    REMOVE_PATCH_CABLE,
    NEW_CONNECTION,
    SEND_OBJECT_DATA,
    SELECT_NEW_OBJECT,
    DELETE_OBJECT
} from "../constants/action-types.js";
import { OBJECT_CONFIGS } from "../constants/object-configs.js";
import OBJECT_CALLBACKS from "../constants/object-callbacks.js";

const initialState = {
    selectedObject: -1,
    objects: {},
    objectsToSendTo: [],
    patchCableData: {
        activePatchCable: 
        {
            id: -1,
            neededConnectionType: -1,
            objectId: -1,
            ioletIndex: -1
        },
        patchCables: {}
    }
};

function rootReducer(state = initialState, action) {   
    let payload = {...action.payload};
 
    if (action.type === ADD_OBJECT) {    
        
        return {
            ...state, 
            objects: {
                ...state.objects, [action.payload.id]: action.payload
            } 
        }
    }

    if (action.type === UPDATE_OBJECT)
    {
        console.log(payload);
        
        var oldType = state.objects[payload.id].type;
        var parsedText = payload.objectText.split(" ");
        var newType = parsedText[0].toUpperCase();
        var attributes = parsedText;
        attributes.splice(0, 1);
        
        if (oldType != newType)
        {
            var newObject = OBJECT_CONFIGS[newType]; 
            newObject.id = payload.id;
            newObject.position = state.objects[payload.id].position;
            newObject = OBJECT_CALLBACKS[newType].ASSIGN_ATTRIBUTES(newObject, attributes);
            
            return {
                ...state, 
                objects: {
                    ...state.objects, [action.payload.id]: newObject
                }
            }
        }

        else
        {
            var updatedObject = OBJECT_CALLBACKS[newType].ASSIGN_ATTRIBUTES(state.objects[payload.id], attributes);
            return {
                ...state, 
                objects: {
                    ...state.objects, [payload.id]: updatedObject
                }
            }
        }
    }

    if (action.type === ADD_PATCH_CABLE)
    {        
        var newPatchCable = payload;
        return {
            ...state, 
            patchCableData: {
                activePatchCable: {
                    id: payload.id,
                    neededConnectionType: payload.neededConnectionType,
                    objectId: payload.objectId,
                    ioletIndex: payload.ioletIndex
                },
                patchCables: 
                {
                    ...state.patchCableData.patchCables, [action.payload.id]: newPatchCable
                }
            }
        }
    }

    if (action.type === REMOVE_PATCH_CABLE)
    {

        var id = payload.id;
        var newPatchCableData = Object.assign({}, state.patchCableData);
        
        delete newPatchCableData.patchCables[id];
        var activePatchCable = state.patchCableData.activePatchCable;
        activePatchCable.id = -1;
        return {
            ...state, 
            patchCableData: {
                activePatchCable: activePatchCable,
                patchCables:  newPatchCableData.patchCables
            }
        }
    }

    if (action.type === NEW_CONNECTION)
    {  
        // debugger;        
        // console.log("outlet object id: ", payload.outObject.id);   
        // console.log("inlet object id: ", payload.inObject.id);   

        console.log(state);

        // debugger;
        let outObjectChild = 
        {
            objectId: payload.inObject.id,
            inletIndex: payload.inObject.ioletIndex,
            outletIndex: payload.outObject.ioletIndex
        };
                
        let inObjectParent = 
        {
            objectId: payload.outObject.id,
            inletIndex: payload.inObject.ioletIndex,
            outletIndex: payload.outObject.ioletIndex
        };

        var updatedCable = {...state.patchCableData.patchCables[state.patchCableData.activePatchCable.id]};
        updatedCable.pos2 = {
            x: payload.position.x,
            y: payload.position.y
        }
        return {
            
            ...state, 
            objects:
            {
                ...state.objects, 
                [payload.outObject.id]: 
                {
                    ...state.objects[payload.outObject.id], 
                    children: [...state.objects[payload.outObject.id], outObjectChild]
                },

                [payload.inObject.id]: 
                {
                    ...state.objects[payload.inObject.id], 
                    parents: [...state.objects[payload.inObject.id], inObjectParent]
                },
            },
            patchCableData: {
                activePatchCable: {
                    id: -1,
                    neededConnectionType: -1
                },
                patchCables: 
                {
                    ...state.patchCableData.patchCables, [state.patchCableData.activePatchCable.id]: updatedCable
                }
            }
        }
    }

    if (action.type === SEND_OBJECT_DATA)
    {          
        console.log('recieved', payload.value, 'from outlet', payload.outletIndex, 'of', payload.objectId);
        console.log('object', payload.objectId, 'outlet', payload.outletIndex, 'is connected to', state.objects[payload.objectId].children);
        
    }

    if (action.type === SELECT_NEW_OBJECT)
    {          
        return {
            ...state,
            selectedObject: payload.id
        }
    }

    if (action.type === DELETE_OBJECT)
    {       
        if (state.selectedObject == -1) return state;
        
        var newObjects = {...state.objects};
        delete newObjects[state.selectedObject];
        return {
            ...state,
            objects: newObjects
        }
    }

    return state;
}

export default rootReducer;
