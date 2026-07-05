var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, Min, Max, IsUUID, Length } from 'class-validator';
// DTOs
export class CreateProductInput {
    name;
    slug;
    sku;
    price;
    compareAtPrice;
    costPrice;
    description;
    shortDescription;
    categoryId;
    brandId;
    images;
    isFeatured;
    isNew;
}
__decorate([
    IsString(),
    Length(1, 200),
    __metadata("design:type", String)
], CreateProductInput.prototype, "name", void 0);
__decorate([
    IsString(),
    IsOptional(),
    Length(1, 250),
    __metadata("design:type", String)
], CreateProductInput.prototype, "slug", void 0);
__decorate([
    IsString(),
    Length(1, 100),
    __metadata("design:type", String)
], CreateProductInput.prototype, "sku", void 0);
__decorate([
    IsNumber(),
    Min(0),
    __metadata("design:type", Number)
], CreateProductInput.prototype, "price", void 0);
__decorate([
    IsNumber(),
    Min(0),
    IsOptional(),
    __metadata("design:type", Number)
], CreateProductInput.prototype, "compareAtPrice", void 0);
__decorate([
    IsNumber(),
    Min(0),
    IsOptional(),
    __metadata("design:type", Number)
], CreateProductInput.prototype, "costPrice", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], CreateProductInput.prototype, "description", void 0);
__decorate([
    IsString(),
    IsOptional(),
    Length(0, 300),
    __metadata("design:type", String)
], CreateProductInput.prototype, "shortDescription", void 0);
__decorate([
    IsUUID(),
    IsOptional(),
    __metadata("design:type", String)
], CreateProductInput.prototype, "categoryId", void 0);
__decorate([
    IsUUID(),
    IsOptional(),
    __metadata("design:type", String)
], CreateProductInput.prototype, "brandId", void 0);
__decorate([
    IsArray(),
    IsOptional(),
    __metadata("design:type", Array)
], CreateProductInput.prototype, "images", void 0);
__decorate([
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], CreateProductInput.prototype, "isFeatured", void 0);
__decorate([
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], CreateProductInput.prototype, "isNew", void 0);
export class UpdateProductInput {
    id;
    name;
    slug;
    price;
    isActive;
    isFeatured;
    description;
    categoryId;
    brandId;
    images;
}
__decorate([
    IsUUID(),
    __metadata("design:type", String)
], UpdateProductInput.prototype, "id", void 0);
__decorate([
    IsString(),
    IsOptional(),
    Length(1, 200),
    __metadata("design:type", String)
], UpdateProductInput.prototype, "name", void 0);
__decorate([
    IsString(),
    IsOptional(),
    Length(1, 250),
    __metadata("design:type", String)
], UpdateProductInput.prototype, "slug", void 0);
__decorate([
    IsNumber(),
    Min(0),
    IsOptional(),
    __metadata("design:type", Number)
], UpdateProductInput.prototype, "price", void 0);
__decorate([
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], UpdateProductInput.prototype, "isActive", void 0);
__decorate([
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], UpdateProductInput.prototype, "isFeatured", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateProductInput.prototype, "description", void 0);
__decorate([
    IsUUID(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateProductInput.prototype, "categoryId", void 0);
__decorate([
    IsUUID(),
    IsOptional(),
    __metadata("design:type", String)
], UpdateProductInput.prototype, "brandId", void 0);
__decorate([
    IsArray(),
    IsOptional(),
    __metadata("design:type", Array)
], UpdateProductInput.prototype, "images", void 0);
export class ProductFilterInput {
    categoryId;
    brandId;
    isFeatured;
    isNew;
    isActive;
    minPrice;
    maxPrice;
    search;
}
__decorate([
    IsUUID(),
    IsOptional(),
    __metadata("design:type", String)
], ProductFilterInput.prototype, "categoryId", void 0);
__decorate([
    IsUUID(),
    IsOptional(),
    __metadata("design:type", String)
], ProductFilterInput.prototype, "brandId", void 0);
__decorate([
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], ProductFilterInput.prototype, "isFeatured", void 0);
__decorate([
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], ProductFilterInput.prototype, "isNew", void 0);
__decorate([
    IsBoolean(),
    IsOptional(),
    __metadata("design:type", Boolean)
], ProductFilterInput.prototype, "isActive", void 0);
__decorate([
    IsNumber(),
    Min(0),
    IsOptional(),
    __metadata("design:type", Number)
], ProductFilterInput.prototype, "minPrice", void 0);
__decorate([
    IsNumber(),
    Min(0),
    IsOptional(),
    __metadata("design:type", Number)
], ProductFilterInput.prototype, "maxPrice", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], ProductFilterInput.prototype, "search", void 0);
export class ProductSortInput {
    field;
    direction;
}
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], ProductSortInput.prototype, "field", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], ProductSortInput.prototype, "direction", void 0);
export class PaginationInput {
    first;
    after;
    last;
    before;
}
__decorate([
    IsNumber(),
    Min(1),
    Max(100),
    IsOptional(),
    __metadata("design:type", Number)
], PaginationInput.prototype, "first", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], PaginationInput.prototype, "after", void 0);
__decorate([
    IsNumber(),
    Min(1),
    Max(100),
    IsOptional(),
    __metadata("design:type", Number)
], PaginationInput.prototype, "last", void 0);
__decorate([
    IsString(),
    IsOptional(),
    __metadata("design:type", String)
], PaginationInput.prototype, "before", void 0);
//# sourceMappingURL=product.types.js.map