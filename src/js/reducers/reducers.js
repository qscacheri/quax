import 
{
    ADD_OBJECT,
    OBJECT_TYPE_CHANGED,
    ADD_PATCH_CABLE,
    REMOVE_PATCH_CABLE,
    NEW_CONNECTION,
    SEND_OBJECT_DATA
} from "../constants/action-types.js";
import { OBJECT_CONFIGS } from "../constants/object-configs.js";

const initialState = {
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
    const payload = action.payload;
 
    if (action.type === ADD_OBJECT) {    
         
        return {
            ...state, 
            objects: {
                ...state.objects, [action.payload.id]: action.payload
            } 
        }
    }

    if (action.type === OBJECT_TYPE_CHANGED)
    {
            
        var newObject = OBJECT_CONFIGS[payload.newObjectType]; 
        newObject.id = payload.id;
        newObject.position = state.objects[payload.id].position;
        
        return {
            ...state, 
            objects: {
                ...state.objects, [action.payload.id]: newObject
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
              
        var outObject = { ...state.objects[payload.outObject.id] };
        outObject.children.push({
            objectId: payload.inObject.id,
            inletIndex: payload.inObject.ioletIndex,
            outletIndex: payload.outObject.ioletIndex
        });

        var inObject = { ...state.objects[payload.inObject.id] };
        inObject.parents.push({
            objectId: payload.outObject.id,
            inletIndex: payload.inObject.ioletIndex,
            outletIndex: payload.outObject.ioletIndex
        });

        var updatedCable = {...state.patchCableData.patchCables[state.patchCableData.activePatchCable.id]};
        updatedCable.pos2 = {
            x: payload.position.x,
            y: payload.position.y
        }
        return {
            ...state, 
            objects:
            {
                ...state.objects, [payload.outObject.id] : outObject, [payload.inObject.id] : inObject
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

    return state;
}

export default rootReducer;
