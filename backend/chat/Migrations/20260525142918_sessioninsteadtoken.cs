using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace chat.Migrations
{
    /// <inheritdoc />
    public partial class sessioninsteadtoken : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Token",
                table: "Users",
                newName: "Session");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Session",
                table: "Users",
                newName: "Token");
        }
    }
}
