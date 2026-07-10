using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InventorySystem.Service.Migrations
{
    /// <inheritdoc />
    public partial class RenamePaidFieldsToBasePrices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TotalAmount",
                table: "Orders",
                newName: "BaseTotalAmount");

            migrationBuilder.RenameColumn(
                name: "PaidTotalAmount",
                table: "Orders",
                newName: "TotalAmount");

            migrationBuilder.RenameColumn(
                name: "UnitPrice",
                table: "OrderItems",
                newName: "BaseUnitPrice");

            migrationBuilder.RenameColumn(
                name: "PaidUnitPrice",
                table: "OrderItems",
                newName: "UnitPrice");

            migrationBuilder.RenameColumn(
                name: "TotalPrice",
                table: "OrderItems",
                newName: "BaseTotalPrice");

            migrationBuilder.RenameColumn(
                name: "PaidTotalPrice",
                table: "OrderItems",
                newName: "TotalPrice");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TotalAmount",
                table: "Orders",
                newName: "PaidTotalAmount");

            migrationBuilder.RenameColumn(
                name: "BaseTotalAmount",
                table: "Orders",
                newName: "TotalAmount");

            migrationBuilder.RenameColumn(
                name: "TotalPrice",
                table: "OrderItems",
                newName: "PaidTotalPrice");

            migrationBuilder.RenameColumn(
                name: "BaseTotalPrice",
                table: "OrderItems",
                newName: "TotalPrice");

            migrationBuilder.RenameColumn(
                name: "UnitPrice",
                table: "OrderItems",
                newName: "PaidUnitPrice");

            migrationBuilder.RenameColumn(
                name: "BaseUnitPrice",
                table: "OrderItems",
                newName: "UnitPrice");
        }
    }
}
