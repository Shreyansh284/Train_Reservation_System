using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemovedFKOfCoachFromPassengers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Passengers_Coaches_CoachId",
                table: "Passengers");

            migrationBuilder.DropIndex(
                name: "IX_Passengers_CoachId",
                table: "Passengers");

            migrationBuilder.DropColumn(
                name: "CoachId",
                table: "Passengers");

            migrationBuilder.AlterColumn<int>(
                name: "Gender",
                table: "Passengers",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "CoachClass",
                table: "Passengers",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CoachClass",
                table: "Passengers");

            migrationBuilder.AlterColumn<int>(
                name: "Gender",
                table: "Passengers",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CoachId",
                table: "Passengers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Passengers_CoachId",
                table: "Passengers",
                column: "CoachId");

            migrationBuilder.AddForeignKey(
                name: "FK_Passengers_Coaches_CoachId",
                table: "Passengers",
                column: "CoachId",
                principalTable: "Coaches",
                principalColumn: "CoachId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
