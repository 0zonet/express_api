"use strict"
const chai = require('chai')
const chaiAsPromised = ('chai-as-promised')

chai.use(chaiAsPromised)

GLOBAL.AssertionError = chai.AssertionError
GLOBAL.expect = chai.expect