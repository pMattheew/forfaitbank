import { Package } from './package.model';
import { User, mockupUser } from './user.model';

export class Operation {
  id?: number;
  name: string;
  ownerUser: User;
  value: number;
  billType: number;
  status: string;
  parentOperation?: Operation;
  childOperations?: Operation[];
  packages: Package[];
  readonly packagesQuantity: number;
  readonly isParent: boolean;
  readonly isChild: boolean;
  readonly maxOperationValue: number;

  constructor(operationProps: {
    name: string;
    ownerUser: User;
    value: number;
    billType: number;
    id?: number;
    parentOperation?: Operation;
  }) {
    this.id = operationProps.id
    this.name = operationProps.name;
    this.ownerUser = operationProps.ownerUser;
    this.status = 'opened';
    this.parentOperation = operationProps.parentOperation;
    this.value = operationProps.value;
    this.maxOperationValue = 5000;

    if (operationProps.billType == 10 || 50 || 100) {
      this.billType = operationProps.billType;
    } else {
      throw new Error('Invalid bill; valid bills are: 10, 50 and 100.');
    }

    if (operationProps.value > this.maxOperationValue) {
      this.childOperations = this.createChildOperations(this.value, this);
    }

    this.isParent = this.childOperations ? true : false;
    this.isChild = this.parentOperation ? true : false;

    if (this.isParent) {
      this.packages = [];
    } else {
      this.packages = this.generatePackages(this.value, this.billType);
    }

    if (this.isParent) {
      let total = 0;
      this.childOperations?.forEach((op) => {
        total += op.packages.length;
      });
      this.packagesQuantity = total;
    } else {
      this.packagesQuantity = this.packages.length;
    }

    this.setStatus();
  }

  private setStatus() {
    if (this.isParent) {
      const RESERVED_OPERATION = (op: Operation) => op.status === 'reserved';

      if (this.childOperations?.some(RESERVED_OPERATION))
        this.status = 'reserved';
      else this.status = 'concluded';
    } else {
      const OPENED_PACKAGE = (pkg: Package) => pkg.status === 'opened';

      if (this.packages.some(OPENED_PACKAGE)) this.status = 'reserved';
      else this.status = 'concluded';
    }
  }

  private createChildOperations(
    value: number,
    parentOperation: Operation
  ): Operation[] {
    let operations: Operation[] = [];

    let closedOperations = Math.round(value / this.maxOperationValue);

    let remainingOperationValue = Math.round(value % this.maxOperationValue);

    for (let i = closedOperations; i > 0; i--) {
      operations.push(
        new Operation({
          name: `${this.name} - Sub-operação ${i}`,
          ownerUser: this.ownerUser,
          value: this.maxOperationValue,
          billType: this.billType,
          parentOperation: parentOperation,
        })
      );
    }

    if (remainingOperationValue > 0) {
      operations.unshift(
        new Operation({
          name: `${this.name} - Sub-operação ${closedOperations + 1}`,
          ownerUser: this.ownerUser,
          value: remainingOperationValue,
          billType: this.billType,
          parentOperation: parentOperation,
        })
      );
    }

    return operations;
  }

  private generatePackages(value: number, billType: number): Package[] {
    let packages: Package[] = [];
    let totalClosedPackages = Math.round(value / billType);
    let remainingBills = Math.round(value % billType);

    for (let i = totalClosedPackages; i > 0; i--) {
      packages.push(new Package(billType, 50, this));
    }

    if (remainingBills > 0) {
      packages.push(new Package(billType, remainingBills, this));
    }

    return packages;
  }
}

const mockupOperations: Operation[] = [
  new Operation({
    id: 1,
    name: "Operação 1",
    ownerUser: mockupUser,
    value: 5000,
    billType: 50,
  }),
  new Operation({
    id: 2,
    name: "Operação 2",
    ownerUser: mockupUser,
    value: 10000,
    billType: 100,
  }),
  new Operation({
    id: 3,
    name: "Operação Bill Ten",
    ownerUser: mockupUser,
    value: 27354,
    billType: 10,
  }),
  new Operation({
    id: 4,
    name: "Operação Lavagem",
    ownerUser: mockupUser,
    value: 603543,
    billType: 100,
  }),
  new Operation({
    id: 5,
    name: "Operação Odebrecht",
    ownerUser: mockupUser,
    value: 100320,
    billType: 50,
  }),
]

export { mockupOperations }
