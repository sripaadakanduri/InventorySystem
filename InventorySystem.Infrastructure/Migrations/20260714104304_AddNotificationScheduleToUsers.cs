using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InventorySystem.Service.Migrations
{
    /// <inheritdoc />
    public partial class AddNotificationScheduleToUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NotificationSchedule",
                table: "Users",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "N");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NotificationSchedule",
                table: "Users");
        }
    }
}
