import RingoObject from '../base/RingoObject'
import OBJECT_TYPES from '../../constants/object-types'
class NumberObject extends RingoObject {
    constructor(processor) {
        super(processor)
        this.numInlets = 2
        this.numOutlets = 1
        this.attributes = {
            value: 0
        }
        this.type = OBJECT_TYPES.NUMBER
    }

    receiveData(inlet, data) {
        switch (inlet) {
            case 0:
                this.sendData(this.attributes.value)
                return;
            case 1:
                this.attributes.value = parseFloat(data)
                return
        }
    }

    updateAttributes(newAttributes) {
        if (newAttributes[1]) this.attributes.value = parseFloat(newAttributes[1])
    }
}

export default NumberObject