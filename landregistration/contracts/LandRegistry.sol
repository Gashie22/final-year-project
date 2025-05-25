
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

/**
 * @title LandRegistry
 * @dev A smart contract for registering and managing land ownership on the blockchain.
 */
contract LandRegistry {
    /**
     * @notice Represents the details of a registered land plot.
     * @param id Unique identifier for the land.
     * @param plotNumber Official plot number or identifier.
     * @param area General area or region where the land is located.
     * @param district Administrative district of the land.
     * @param city City or town where the land is located.
     * @param state Province or state where the land is located.
     * @param areaSqYd Area of the land in square yards.
     * @param owner The current owner's Ethereum address.
     * @param isForSale Indicates if the land is currently listed for sale.
     * @param transferRequest The Ethereum address that has requested a transfer for this land. Address(0) if no request is pending.
     */
    struct Land {
        uint256 id;
        string plotNumber;
        string area;
        string district;
        string city;
        string state;
        uint256 areaSqYd;
        address owner;
        bool isForSale;
        address transferRequest;
    }

    /**
     * @notice Represents a record in the ownership history of a land plot.
     * @param owner The Ethereum address of a past owner.
     * @param timestamp The Unix timestamp when the ownership was recorded.
     */
    struct OwnershipHistory {
        address owner;
        uint256 timestamp;
    }

    uint256 public landCount; // Tracks the total number of registered land plots.
    mapping(uint256 => Land) public lands; // Maps a land ID to its Land struct.
    mapping(address => uint256[]) public ownerLands; // Maps an owner's address to an array of their land IDs.
    mapping(uint256 => OwnershipHistory[]) public landOwnershipHistory; // Maps a land ID to an array of its ownership history records.

    // Mapping to check if a land with specific details has already been registered.
    mapping(bytes32 => bool) private landExists;

    // Define the admin address as a constant for immutability.
    address public constant ADMIN_ADDRESS =
      0xdC2D7AaED0e3DA74827A8b20eBe1A2c4CB6729C9;
    address public admin = ADMIN_ADDRESS; // Initializes the admin with the constant address upon contract deployment.

    /**
     * @dev Emitted when a new land plot is successfully registered.
     * @param id The unique ID of the registered land.
     * @param owner The Ethereum address of the initial owner.
     * @param plotNumber The official plot number.
     * @param area The general area.
     * @param district The administrative district.
     * @param city The city or town.
     * @param state The province or state.
     * @param areaSqYd The area in square yards.
     */
    event LandRegistered(
        uint256 id,
        address owner,
        string plotNumber,
        string area,
        string district,
        string city,
        string state,
        uint256 areaSqYd
    );

    /**
     * @dev Emitted when a land plot is put up for sale by its owner.
     * @param id The ID of the land listed for sale.
     * @param owner The Ethereum address of the owner listing the land.
     */
    event LandForSale(uint256 id, address owner);

    /**
     * @dev Emitted when a user requests a transfer of a land plot that is for sale.
     * @param id The ID of the land for which a transfer is requested.
     * @param requester The Ethereum address of the user requesting the transfer.
     */
    event TransferRequested(uint256 id, address requester);

    /**
     * @dev Emitted when the ownership of a land plot is successfully transferred.
     * @param id The ID of the transferred land.
     * @param from The Ethereum address of the previous owner.
     * @param to The Ethereum address of the new owner.
     */
    event LandTransferred(uint256 id, address from, address to);

    /**
     * @dev Emitted when the owner approves a pending transfer request.
     * @param id The ID of the land whose transfer was approved.
     * @param newOwner The Ethereum address of the new owner after approval.
     */
    event TransferApproved(uint256 id, address newOwner);

    /**
     * @dev Emitted when the owner denies a pending transfer request.
     * @param id The ID of the land whose transfer was denied.
     * @param requester The Ethereum address of the user whose transfer request was denied.
     */
    event TransferDenied(uint256 id, address requester);

    /**
     * @dev Constructor to initialize the contract.
     * Sets the initial land count to zero.
     * The admin address is initialized directly with the constant.
     */
    constructor() {
        landCount = 0;
    }

    /**
     * @dev Modifier to restrict access to functions to the owner of a specific land plot.
     * @param _landId The ID of the land to check ownership against.
     */
    modifier onlyOwner(uint256 _landId) {
        require(
            lands[_landId].owner == msg.sender,
            "You are not the owner of this land"
        );
        _; // Execute the function if the condition is met.
    }

    /**
     * @dev Modifier to restrict access to functions to the contract administrator.
     */
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _; // Execute the function if the condition is met.
    }

    /**
     * @dev Registers a new land plot in the registry.
     * Only users can call this function to register land they own.
     * @param _plotNumber The official plot number of the land.
     * @param _area The general area or region.
     * @param _district The administrative district.
     * @param _city The city or town.
     * @param _state The province or state.
     * @param _areaSqYd The area of the land in square yards.
     */
    function registerLand(
        string memory _plotNumber,
        string memory _area,
        string memory _district,
        string memory _city,
        string memory _state,
        uint256 _areaSqYd
    ) public {
        // Create a unique hash based on key land details to prevent duplicate entries.
        bytes32 landHash = keccak256(
            abi.encodePacked(_plotNumber, _district, _state)
        );

        // Ensure that a land with the same key details has not been registered before.
        require(
            !landExists[landHash],
            "Error: Land with these details is already registered"
        );

        landCount++; // Increment the total count of registered lands.
        // Create a new Land struct and store it in the lands mapping.
        lands[landCount] = Land(
            landCount,
            _plotNumber,
            _area, 
            _district,
            _city,
            _state,
            _areaSqYd,
            msg.sender, // The sender of the transaction becomes the initial owner.
            false, // Initially, the land is not for sale.
            address(0) // No transfer request is pending initially.
        );

        // Mark this land as existing using its unique hash.
        landExists[landHash] = true;

        // Add the new land ID to the owner's list of owned lands.
        ownerLands[msg.sender].push(landCount);
        // Record the initial ownership in the land's ownership history.
        landOwnershipHistory[landCount].push(
            OwnershipHistory(msg.sender, block.timestamp)
        );
        // Emit an event to log the successful land registration.
        emit LandRegistered(
            landCount,
            msg.sender,
            _plotNumber,
            _area,
            _district,
            _city,
            _state,
            _areaSqYd
        );
    }

    /**
     * @dev Allows the owner of a land plot to mark it as being for sale.
     * Only the owner of the land can call this function.
     * @param _landId The ID of the land to put up for sale.
     */
    function putLandForSale(uint256 _landId) public onlyOwner(_landId) {
        lands[_landId].isForSale = true;
        emit LandForSale(_landId, msg.sender);
    }

    /**
     * @dev Allows a user to request a transfer of a land plot that is for sale.
     * The land must be marked as for sale, and no other transfer request should be pending.
     * The requester cannot be the current owner.
     * @param _landId The ID of the land for which a transfer is requested.
     */
    function requestTransfer(uint256 _landId) public {
        require(lands[_landId].isForSale, "Land is not for sale");
        require(
            lands[_landId].transferRequest == address(0),
            "Transfer already requested"
        );
        require(
            msg.sender != lands[_landId].owner,
            "Owner cannot request transfer"
        );
        lands[_landId].transferRequest = msg.sender;
        emit TransferRequested(_landId, msg.sender);
    }

    /**
     * @dev Allows the owner of a land plot to approve a pending transfer request.
     * Only the owner of the land can call this function, and a transfer request must be pending.
     * @param _landId The ID of the land for which to approve the transfer.
     */
    function approveTransfer(uint256 _landId) public onlyOwner(_landId) {
        require(
            lands[_landId].transferRequest != address(0),
            "No transfer request pending"
        );
        address newOwner = lands[_landId].transferRequest;

        // Remove the land ID from the previous owner's list.
        uint256[] storage ownerLandList = ownerLands[msg.sender];
        for (uint256 i = 0; i < ownerLandList.length; i++) {
            if (ownerLandList[i] == _landId) {
                ownerLandList[i] = ownerLandList[ownerLandList.length - 1];
                ownerLandList.pop();
                break;
            }
        }

        // Update the land's owner, set isForSale to false, and clear the transfer request.
        lands[_landId].owner = newOwner;
        lands[_landId].isForSale = false;
        lands[_landId].transferRequest = address(0);
        // Add the land ID to the new owner's list.
        ownerLands[newOwner].push(_landId);
        // Record the transfer in the land's ownership history.
        landOwnershipHistory[_landId].push(
            OwnershipHistory(newOwner, block.timestamp)
        );

        emit LandTransferred(_landId, msg.sender, newOwner);
        emit TransferApproved(_landId, newOwner);
    }

    /**
     * @dev Allows the owner of a land plot to deny a pending transfer request.
     * Only the owner of the land can call this function, and a transfer request must be pending.
     * @param _landId The ID of the land for which to deny the transfer.
     */
    function denyTransfer(uint256 _landId) public onlyOwner(_landId) {
        require(
            lands[_landId].transferRequest != address(0),
            "No transfer request pending"
        );
        address requester = lands[_landId].transferRequest;
        lands[_landId].transferRequest = address(0);
        emit TransferDenied(_landId, requester);
    }

    // /**
    //  * @dev Allows anyone to view the details of a registered land plot.
    //  * @param _landId The ID of the land to retrieve details for.
    //  * @return plotNumber, area, district, city, state, areaSqYd, owner The details of the land.
    //  */

    function verifyLand(
        uint256 _landId
    )
        public
        view
        returns (
            string memory plotNumber,
            string memory area,
            string memory district,
            string memory city,
            string memory state,
            uint256 areaSqYd,
            address owner
        )
    {
        Land memory land = lands[_landId];
        return (
            land.plotNumber,
            land.area,
            land.district,
            land.city,
            land.state,
            land.areaSqYd,
            land.owner
        );
    }

    /**
     * @dev Returns an array of land IDs owned by a specific address.
     * @param _owner The Ethereum address of the owner.
     * @return An array of uint256 representing the IDs of the lands owned by the address.
     */
    function getLandsByOwner(
        address _owner
    ) public view returns (uint256[] memory) {
        return ownerLands[_owner];
    }

    /**
     * @dev Returns an array of land IDs owned by a specific address that have pending transfer requests.
     * @param _owner The Ethereum address of the owner.
     * @return An array of uint256 representing the IDs of the lands with pending transfer requests.
     */
    function getPendingTransferRequests(
        address _owner
    ) public view returns (uint256[] memory) {
        uint256[] memory ownedLands = ownerLands[_owner];
        uint256 pendingCount = 0;

        // Count the number of lands with pending transfer requests.
        for (uint256 i = 0; i < ownedLands.length; i++) {
            if (lands[ownedLands[i]].transferRequest != address(0)) {
                pendingCount++;
            }
        }

        // Create a new array to store the IDs of the lands with pending requests.
        uint256[] memory pendingRequests = new uint256[](pendingCount);
        uint256 index = 0;
        // Populate the array with the IDs of the lands with pending requests.
        for (uint256 i = 0; i < ownedLands.length; i++) {
            if (lands[ownedLands[i]].transferRequest != address(0)) {
                pendingRequests[index] = ownedLands[i];
                index++;
            }
        }

        return pendingRequests;
    }

    /**
     * @dev Allows the admin to retrieve details of all registered land plots.
     * @return An array of Land structs containing details of all registered lands.
     */
    function getAllLands() public view onlyAdmin returns (Land[] memory) {
        Land[] memory allLands = new Land[](landCount);
        for (uint256 i = 1; i <= landCount; i++) {
            allLands[i - 1] = lands[i];
        }
        return allLands;
    }

    /**
     * @dev Allows the admin to retrieve the ownership history of a specific land plot.
     * @param _landId The ID of the land to retrieve the ownership history for.
     * @return An array of OwnershipHistory structs representing the past owners and timestamps.
     */
    function getPastOwnershipDetails(
        uint256 _landId
    ) public view onlyAdmin returns (OwnershipHistory[] memory) {
        return landOwnershipHistory[_landId];
    }
}
