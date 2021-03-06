import RingoObject from '../base/RingoObject'
import OBJECT_TYPES from '../../constants/object-types'
import { Frequency } from 'tone'

class NumberObject extends RingoObject {
    constructor(processor, position) {
        super(processor, position)
        this.numInlets = 1
        this.numOutlets = 1
        this.type = OBJECT_TYPES.M2F
        this.inletDescriptions = ['midi note number']
        this.outletDescriptions = ['frequency']

    }

    receiveData(inlet, data) {
        switch (inlet) {
            case 0:
                this.convertToFreq(data)
                return;
        }
    }

    convertToFreq(data) {
        const freq = Frequency(data, "midi").toFrequency()
        this.sendData(freq)
    }

    updateAttributes(newAttributes) {
        if (newAttributes[1]) this.attributes.value = parseFloat(newAttributes[1])
    }

    connect(outletIndex, inletIndex, inputID) {
        this.receivers[outletIndex][inputID] = inletIndex
    }
}

export default NumberObject